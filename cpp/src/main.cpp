#include <iostream>
#include <stdio.h>
#include <fstream>
#include <8puzzle.h>
#include "include/json.hpp"

//====== INPUT ======//
struct Input {
  std::string assessmentFunction;
  std::string algorithm;
  std::vector<int> board;
  int position;
  int cost;

  static void show(Input &input) {
    std::cout << "===== JSON =====\n";
    std::cout << "bor: ";
    for(auto item = input.board.begin(); item != input.board.end(); item++) {
      printf("%d ", *item);
    }
    std::cout << "\n";
    printf("pos: %d\n", input.position);
    std::cout << "alg: " << input.algorithm << "\n";
    std::cout << "fun: " << input.assessmentFunction << "\n\n";
  }
};

Input load(char path[]) {
  Input input;
  nlohmann::json json = nlohmann::json();
  std::ifstream file = std::ifstream(path);
  
  file >> json;

  input.board = json["board"].get<std::vector<int>>();
  input.position = json["position"].get<int>();
  input.algorithm = json["algorithm"];
  input.assessmentFunction = json["assessment-function"];

  return input;
}

void getAssessmentFunction(Input &input, int (**assessmentFunction)(std::vector<int> &board)) {
  if(!input.assessmentFunction.compare("manhattan-distance")) {
    *assessmentFunction = &__8puzzle::Functions::manhattanDistance;
  }
  else if(!input.assessmentFunction.compare("number-of-pieces-out-place")) {
    *assessmentFunction = &__8puzzle::Functions::numberOfPiecesOutPlace;
  }
  else if(!input.assessmentFunction.compare("number-of-pieces-in-place")) {
    *assessmentFunction = &__8puzzle::Functions::numberOfPiecesInPlace;
  }
}

int main() {
  Input input = load("./input.json");
  
  // Input::show(input);
  
  //define assessment function to use
  int (*assessmentFunction)(std::vector<int> &board);
  getAssessmentFunction(input, &assessmentFunction);

  //Generate initial cost
  input.cost = (*assessmentFunction)(input.board);

  //variables to analysis of algorithm
  clock_t start, end;
  clock_t executionTime;

  //before run algorithm
  __8puzzle::MyGraph.root = new __8puzzle::Puzzle();
  __8puzzle::MyGraph.root->board = input.board;
  __8puzzle::MyGraph.root->position = input.position;
  __8puzzle::MyGraph.root->cost = (*assessmentFunction)(input.board);
  __8puzzle::MyGraph.root->acc = 0;

  //define algorithm to use
  if(!input.algorithm.compare("hill-climbing")) {
    // printf("==== HILL CLIMBING ====\n");
    start = clock();
    __8puzzle::MyGraph.visit.push_back(__8puzzle::MyGraph.root);
    __8puzzle::MyGraph.HillClimbing(__8puzzle::MyGraph.root, assessmentFunction);
    end = clock();
  }
  else if(!input.algorithm.compare("a-star")) {
    // printf("==== A STAR ====\n");
    start = clock();
    __8puzzle::MyGraph.AStar(__8puzzle::MyGraph.root, assessmentFunction);
    // printf("Number of expansion nodes: %zd\n", __8puzzle::MyGraph.visit.size());
    end = clock();
  }

  executionTime = end-start;
  // printf("Execution Time: %ldms\n", executionTime);

  // __8puzzle::Puzzle::show(__8puzzle::MyGraph.solution);

  //Write output json file
  nlohmann::json out = __8puzzle::MyGraph.toJson();
  
  out["executionTime"] = executionTime;
  out["number-of-expansions"] = __8puzzle::MyGraph.visit.size();

  std::ofstream outFile = std::ofstream("./output.json");
  outFile << out;

  return 0;
}
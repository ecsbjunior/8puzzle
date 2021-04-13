#include <iostream>
#include <algorithm>
#include <stack>
#include <queue>
#include <string>
#include <8puzzle.h>
#include "json.hpp"

namespace __8puzzle {
  //====== PUZZLE ======//
  bool Puzzle::cmp(Puzzle* a, Puzzle* b) {
    return a->cost < b->cost;
  }

  bool Puzzle::icmp(Puzzle* a, Puzzle* b) {
    return a->cost > b->cost;
  }
  
  void Puzzle::show(std::vector<Puzzle*> puzzles) {
    for(auto puzz = puzzles.begin(); puzz != puzzles.end(); puzz++) {
      printf("COST: %d\n", (*puzz)->cost);
      printf("ACC: %d\n", (*puzz)->acc);
      for(int i = 0; i < (*puzz)->board.size(); i++) {
        printf("%d ", (*puzz)->board[i]);
        if((i+1)%3==0) printf("\n");
      }
      printf("\n");
    }
  }

  //====== GRAPH ======//
  void Graph::reset() {
    Graph::root = NULL;
    Graph::finished = false;
    Graph::visit.clear();
  }

  bool Graph::wasVisited(Puzzle &puzzle) {
    for(int i = 0; i < Graph::visit.size(); i++) {
      bool visited = true;
      for(int j = 0; j < Graph::visit[i]->board.size() && visited; j++) {
        if(Graph::visit[i]->board[j] != puzzle.board[j]) {
          visited = false;
        }
      }
      if(visited) {
        return true;
      }
    }
    return false;
  }

  void Graph::generateSolution(Puzzle* puzzle) {
    while(puzzle != NULL) {
      Graph::solution.push_back(puzzle);
      puzzle = puzzle->father;
    }
  }

  void Graph::HillClimbing(Puzzle* puzzle, int (*assessmentFunction)(std::vector<int> &board)) {
    Graph::visit.push_back(puzzle);

    if(!assessmentFunction(puzzle->board)) {
      // printf("SOLVED!!\n");
      Graph::generateSolution(puzzle);
      Graph::finished = true;
      return;
    }

    std::vector<Puzzle*> puzzles;

    Functions::generatePaths(puzzle, puzzles, assessmentFunction);

    std::sort(puzzles.begin(), puzzles.end(), Puzzle::cmp);

    for(auto puzz = puzzles.begin(); puzz != puzzles.end(); puzz++) {
      if(!Graph::wasVisited(**puzz)) {
        //Father to child
        puzzle->childs.push_back(*puzz);
        //Child to father
        (*puzz)->father = puzzle;

        if((*puzz)->cost < puzzle->cost) {
          HillClimbing(*puzz, assessmentFunction);
        }
      }
    }
  }

  void Graph::HillClimbingIterative(Puzzle* puzzle, int (*assessmentFunction)(std::vector<int> &board)) {
    std::stack<Puzzle*> stack;
    int cont = 0;
    
    stack.push(puzzle);
    while(!stack.empty() && !Graph::finished) {
      puzzle = stack.top();
      stack.pop();
      
      Graph::visit.push_back(puzzle);

      if(!assessmentFunction(puzzle->board)) {
        Graph::generateSolution(puzzle);
        Graph::finished = true;
      }
      else {
        std::vector<Puzzle*> puzzles;
        Functions::generatePaths(puzzle, puzzles, assessmentFunction);
        std::sort(puzzles.begin(), puzzles.end(), Puzzle::icmp);

        for(auto puzz = puzzles.begin(); puzz != puzzles.end(); puzz++) {
          if(!Graph::wasVisited(**puzz)) {
            puzzle->childs.push_back(*puzz);
            (*puzz)->father = puzzle;

            stack.push(*puzz);
          }
        }
      }
    }
  }

  void Graph::AStar(Puzzle* puzzle, int (*assessmentFunction)(std::vector<int> &board)) {
    auto compare = [](Puzzle* a, Puzzle* b) {
      return a->cost > b->cost;
    };

    std::priority_queue<Puzzle*, std::vector<Puzzle*>, decltype(compare)> pq(compare);

    pq.push(puzzle);
    while(!pq.empty() && !Graph::finished) {
      puzzle = pq.top();
      pq.pop();

      Graph::visit.push_back(puzzle);

      if(!assessmentFunction(puzzle->board)) {
        Graph::generateSolution(puzzle);
        Graph::finished = true;
      }
      else {
        std::vector<Puzzle*> puzzles;
        Functions::generatePaths(puzzle, puzzles, assessmentFunction);

        for(auto puzz = puzzles.begin(); puzz != puzzles.end(); puzz++) {
          if(!Graph::wasVisited(**puzz)) {
            puzzle->childs.push_back(*puzz);
            
            (*puzz)->father = puzzle;
            (*puzz)->acc = puzzle->acc+1;
            (*puzz)->cost += (*puzz)->acc;

            pq.push(*puzz);
          }
        }
      }
    }
  }

  nlohmann::json Graph::toJson() {
    nlohmann::json json = nlohmann::json();
    nlohmann::json jsonAux = nlohmann::json();
    std::queue<Puzzle*> queue;
    Puzzle* puzzle;
    int currentLine = 1;

    for(auto puzzle = Graph::solution.begin(); puzzle != Graph::solution.end(); puzzle++) {
      json["solution"].push_back({
        {"board", (*puzzle)->board},
        {"position", (*puzzle)->position},
        {"cost", (*puzzle)->cost},
        {"acc", (*puzzle)->acc}
      });
    }
    
    std::vector<int> rootChilds;
    for(auto child = Graph::root->childs.begin(); child != Graph::root->childs.end(); child++) {
      rootChilds.push_back(currentLine++);
      queue.push(*child);
    }

    json["expansions"].push_back({
      {"board", Graph::root->board},
      {"position", Graph::root->position},
      {"cost", Graph::root->cost},
      {"acc", Graph::root->acc},
      {"childs", rootChilds}
    });

    while(!queue.empty()) {
      puzzle = queue.front();
      queue.pop();

      std::vector<int> childs;
      for(auto child = puzzle->childs.begin(); child != puzzle->childs.end(); child++) {  
        childs.push_back(currentLine++);
        queue.push(*child);
      }

      json["expansions"].push_back({
        {"board", puzzle->board},
        {"position", puzzle->position},
        {"cost", puzzle->cost},
        {"acc", puzzle->acc},
        {"childs", childs}
      });
    }

    return json;
  }

  void Functions::generatePaths(Puzzle* puzzle, std::vector<Puzzle*> &puzzles, int (*assessmentFunction)(std::vector<int> &board)) {
    if(Functions::canGoUp(puzzle->position)) {
      Puzzle* newPuzzle = new Puzzle();
      newPuzzle->board = puzzle->board;
      newPuzzle->position = puzzle->position;
      
      Functions::moveToUp(newPuzzle);
      newPuzzle->cost = (*assessmentFunction)(newPuzzle->board);

      puzzles.push_back(newPuzzle);
    }
    
    if(Functions::canGoRight(puzzle->position)) {
      Puzzle* newPuzzle = new Puzzle();
      newPuzzle->board = puzzle->board;
      newPuzzle->position = puzzle->position;
      
      Functions::moveToRight(newPuzzle);
      newPuzzle->cost = (*assessmentFunction)(newPuzzle->board);

      puzzles.push_back(newPuzzle);
    }
    
    if(Functions::canGoDown(puzzle->position)) {
      Puzzle* newPuzzle = new Puzzle();
      newPuzzle->board = puzzle->board;
      newPuzzle->position = puzzle->position;
      
      Functions::moveToDown(newPuzzle);
      newPuzzle->cost = (*assessmentFunction)(newPuzzle->board);

      puzzles.push_back(newPuzzle);
    }
    
    if(Functions::canGoLeft(puzzle->position)) {
      Puzzle* newPuzzle = new Puzzle();
      newPuzzle->board = puzzle->board;
      newPuzzle->position = puzzle->position;
      
      Functions::moveToLeft(newPuzzle);
      newPuzzle->cost = (*assessmentFunction)(newPuzzle->board);

      puzzles.push_back(newPuzzle);
    }
  }

  bool Functions::canGoUp(int position) {
    return position+3<=8;
  }

  bool Functions::canGoRight(int position) {
    return position%3>0;
  }

  bool Functions::canGoDown(int position) {
    return position-3>=0;
  }

  bool Functions::canGoLeft(int position) {
    return position%3<2;
  }

  void Functions::moveToUp(Puzzle* puzzle)  {
    if(Functions::canGoUp(puzzle->position)) {
      puzzle->board[puzzle->position] = puzzle->board[puzzle->position+3];
      puzzle->board[puzzle->position+3] = 0;
      puzzle->position+=3;
    }
  }

  void Functions::moveToRight(Puzzle* puzzle)  {
    if(Functions::canGoRight(puzzle->position)) {
      puzzle->board[puzzle->position] = puzzle->board[puzzle->position-1];
      puzzle->board[puzzle->position-1] = 0;
      puzzle->position--;
    }
  }

  void Functions::moveToDown(Puzzle* puzzle)  {
    if(Functions::canGoDown(puzzle->position)) {
      puzzle->board[puzzle->position] = puzzle->board[puzzle->position-3];
      puzzle->board[puzzle->position-3] = 0;
      puzzle->position-=3;
    }
  }

  void Functions::moveToLeft(Puzzle* puzzle)  {
    if(Functions::canGoLeft(puzzle->position)) {
      puzzle->board[puzzle->position] = puzzle->board[puzzle->position+1];
      puzzle->board[puzzle->position+1] = 0;
      puzzle->position++;
    }
  }

  int Functions::manhattanDistance(std::vector<int> &board) {
    int distance = 0;

    for(int i = 0; i < board.size(); i++) {
      if(board[i]) {
        int currentY = i/3;
        int currentX = i%3;
        int targetY = (board[i]-1)/3;
        int targetX = (board[i]-1)%3;
        distance += abs(currentX - targetX) + abs(currentY - targetY);
      }
    }

    return distance;
  }

  int Functions::numberOfPiecesOutPlace(std::vector<int> &board) {
    int numberOfPieces = 0;

    for(int i = 0; i < board.size(); i++) {
      if(board[i] && board[i] != i+1) {
        numberOfPieces++;
      }
    }

    return numberOfPieces;
  }

  int Functions::numberOfPiecesInPlace(std::vector<int> &board) {
    int numberOfPieces = 0;

    for(int i = 0; i < board.size(); i++) {
      if(board[i] && board[i] == i+1) {
        numberOfPieces++;
      }
    }

    return (8 - numberOfPieces);
  }
}

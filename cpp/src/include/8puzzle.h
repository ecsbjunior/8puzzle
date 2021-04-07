#ifndef __8PUZZLE_H
#define __8PUZZLE_H

#include <vector>
#include <json.hpp>

#ifdef PUZZLE_IMPLEMENTATION
  #define PUZZLE_API __declspec(dllexport)
#else
  #define PUZZLE_API __declspec(dllimport)
#endif

namespace __8puzzle {
  struct PUZZLE_API Puzzle final {
    std::vector<int> board;
    std::vector<Puzzle*> childs;
    Puzzle* father;
    int position;
    int cost;
    int acc;

    static bool cmp(Puzzle* a, Puzzle* b);
    static void show(std::vector<Puzzle*> puzzles);
  };

  static struct PUZZLE_API Graph final {
    Puzzle* root;
    bool finished;
    std::vector<Puzzle*> visit;
    std::vector<Puzzle*> solution;

    void reset();
    bool wasVisited(Puzzle &puzzle);
    void generateSolution(Puzzle* puzzle);
    nlohmann::json toJson();

    void HillClimbing(Puzzle* puzzle, int (*assessmentFunction)(std::vector<int> &board));
    void AStar(Puzzle* puzzle, int (*assessmentFunction)(std::vector<int> &board));
  } MyGraph;
  
  struct PUZZLE_API Functions final {
    static void generatePaths(Puzzle* puzzle, std::vector<Puzzle*> &puzzles, int (*assessmentFunction)(std::vector<int> &board));

    static bool canGoUp(int position);
    static bool canGoRight(int position);
    static bool canGoDown(int position);
    static bool canGoLeft(int position);

    static void moveToUp(Puzzle* puzzle);
    static void moveToRight(Puzzle* puzzle);
    static void moveToDown(Puzzle* puzzle);
    static void moveToLeft(Puzzle* puzzle);

    static int manhattanDistance(std::vector<int> &board);
    static int numberOfPiecesOutPlace(std::vector<int> &board);
    static int numberOfPiecesInPlace(std::vector<int> &board);
  };
};

#endif

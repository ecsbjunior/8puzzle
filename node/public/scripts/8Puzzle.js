function __8Puzzle() {
  const state = {
    board: [1, 2, 3, 4, 5, 6, 7, 8, 0],
    position: 8,
    cost: 0,
    acc: 0,
  }

  function canGoUp() {
    return state.position + 3 <= 8;
  }

  function canGoRight() {
    return state.position % 3 - 1 >= 0;
  }

  function canGoDown() {
    return state.position - 3 >= 0;
  }

  function canGoLeft() {
    return state.position % 3 + 1 <= 2;
  }

  function moveToUp() {
    if (canGoUp()) {
      state.board[state.position] = state.board[state.position + 3];
      state.board[state.position + 3] = 0;
      state.position += 3;
    }
  }

  function moveToRight() {
    if (canGoRight()) {
      state.board[state.position] = state.board[state.position - 1];
      state.board[state.position - 1] = 0;
      state.position -= 1;
    }
  }

  function moveToDown() {
    if (canGoDown()) {
      state.board[state.position] = state.board[state.position - 3];
      state.board[state.position - 3] = 0;
      state.position -= 3;
    }
  }

  function moveToLeft() {
    if (canGoLeft()) {
      state.board[state.position] = state.board[state.position + 1];
      state.board[state.position + 1] = 0;
      state.position += 1;
    }
  }

  function getState() {
    return state;
  }

  return {
    getState,
    moveToUp,
    moveToRight,
    moveToDown,
    moveToLeft
  };
};

export default __8Puzzle;

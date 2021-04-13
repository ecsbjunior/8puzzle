function __8PuzzleAnalysis(puzzle) {
  const state = {
    forwardButton: document.getElementById('forward-button'),
    backwardButton: document.getElementById('backward-button'),
    solved: false,
    solutionIndex: 0,
    executionTime: 0,
    numberOfExpansions: 0,
    expansions: [],
    solution: [],
  };

  function listen() {
    function update() {
      // const puzzleNumberOfExpansions = document.getElementById('puzzle-number-of-expansions').childNodes[1];
      // const puzzleExecutionTime = document.getElementById('puzzle-execution-time').childNodes[1];
      const puzzleSteps = document.getElementById('puzzle-steps').childNodes[1];
      const puzzleCost = document.getElementById('puzzle-cost').childNodes[1];
      const puzzleAcc = document.getElementById('puzzle-acc').childNodes[1];

      if(state.solved) {
        puzzle.getState().board = state.solution[state.solutionIndex].board;
        puzzle.getState().position = state.solution[state.solutionIndex].position;
        puzzle.getState().cost = state.solution[state.solutionIndex].cost;
        puzzle.getState().acc = state.solution[state.solutionIndex].acc;
      }
      
      // puzzleNumberOfExpansions.innerText = `${state.numberOfExpansions}`;
      // puzzleNumberOfExpansions.style.color = 'var(--cyan)';

      // puzzleExecutionTime.innerText = `${state.executionTime}ms`;
      // puzzleExecutionTime.style.color = 'var(--cyan)';
      
      puzzleSteps.innerText = `${state.solutionIndex+1} of ${state.solution.length}`;
      puzzleSteps.style.color = 'var(--cyan)';
      
      puzzleCost.innerText = `${puzzle.getState().cost}`;
      puzzleCost.style.color = 'var(--cyan)';

      puzzleAcc.innerText = `${puzzle.getState().acc}`;
      puzzleAcc.style.color = 'var(--cyan)';
    }

    state.forwardButton.addEventListener('click', () => {
      if(state.solutionIndex < state.solution.length-1) {
        state.solutionIndex+=1;
        update()
      }
    });
  
    state.backwardButton.addEventListener('click', () => {
      if(state.solutionIndex > 0) {
        state.solutionIndex-=1;
        update();
      }
    });
  }

  function getState() {
    return state;
  }

  function expansionInSolution(expansion) {
    function equals(a1, a2) {
      return a1.length === a2.length && (
        a1.every((item, index) => item === a2[index])
      )
    }

    for(const item of state.solution) {
      if(equals(item.board, expansion)) {
        return true;
      }
    }

    return false;
  }

  return {
    listen,
    expansionInSolution,
    getState
  };
}

export default __8PuzzleAnalysis;

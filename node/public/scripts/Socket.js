function Socket(puzzle, puzzleAnalysis) {
  const state = {
    socket: io()
  };

  function listen() {
    state.socket.on('connect', () => {
      console.log('frontend connected');
    });

    state.socket.on('loadPuzzle', data => {
      const puzzleNumberOfExpansions = document.getElementById('puzzle-number-of-expansions').childNodes[1];
      const puzzleExecutionTime = document.getElementById('puzzle-execution-time').childNodes[1];
      const puzzleStatus = document.getElementById('puzzle-status').childNodes[1];
      const puzzleSteps = document.getElementById('puzzle-steps').childNodes[1];
      const puzzleCost = document.getElementById('puzzle-cost').childNodes[1];
      const puzzleAcc = document.getElementById('puzzle-acc').childNodes[1];

      puzzleNumberOfExpansions.innerText = "";
      puzzleExecutionTime.innerText = "";
      puzzleStatus.innerText = "";
      puzzleSteps.innerText = "";
      puzzleCost.innerText = "";
      puzzleAcc.innerText = "";
      
      if(data.solution) {
        puzzleAnalysis.getState().solution = data.solution;
        puzzleAnalysis.getState().solution.reverse();
        puzzleAnalysis.getState().solved = true;

        puzzle.getState().board = data.solution[0].board;
        puzzle.getState().cost = data.solution[0].cost;
        puzzle.getState().acc = data.solution[0].acc;
      }

      
      puzzleAnalysis.getState().expansions = data.expansions;
      puzzleAnalysis.getState().executionTime = data.executionTime;
      puzzleAnalysis.getState().numberOfExpansions = data.numberOfExpansions;
      puzzleAnalysis.getState().solutionIndex = 0;
      
      puzzleNumberOfExpansions.innerText = `${data["number-of-expansions"]}`;
      puzzleNumberOfExpansions.style.color = 'var(--cyan)';

      puzzleExecutionTime.innerText = `${data.executionTime}ms`;
      puzzleExecutionTime.style.color = 'var(--cyan)';

      puzzleStatus.innerText = data.solution ? "Solved" : "Not solved";
      puzzleStatus.style.color = data.solution ? "var(--green)" : "var(--red)";
      
      if(data.solution) {
        puzzleSteps.innerText = `1 of ${data.solution.length}`;
        puzzleSteps.style.color = 'var(--cyan)';

        puzzleCost.innerText = `${puzzle.getState().cost}`;
        puzzleCost.style.color = 'var(--cyan)';

        puzzleAcc.innerText = `${puzzle.getState().acc}`;
        puzzleAcc.style.color = 'var(--cyan)';
      }
    });
  }

  return {
    listen,
    io: state.socket
  };
}

export default Socket;

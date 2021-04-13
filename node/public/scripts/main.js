import KeyboardInputEvent from './KeyboardInputEvent.js';
import __8PuzzleAnalysis from './8PuzzleAnalysis.js';
import __8Puzzle from './8Puzzle.js';
import Render from './Render.js';
import Socket from './Socket.js';
import TreeView from './TreeView.js';

function main() {
  const puzzle = __8Puzzle();
  const puzzleAnalysis = __8PuzzleAnalysis(puzzle);
  const socket = Socket(puzzle, puzzleAnalysis);
  const render = Render(puzzle);
  const keyboardInputEvent = KeyboardInputEvent(puzzle);
  const treeView = TreeView(puzzleAnalysis);

  const showTreeButton = document.getElementById('show-tree-button');
  const solveButton = document.getElementById('solve-button');
  const shuffleButton = document.getElementById('shuffle-button');
  const configShuffleButton = document.getElementById('config-shuffle-button');
  const algorithmSelect = document.getElementById('algorithm-select');
  const assessmentFunctionSelect = document.getElementById('assessment-function');

  socket.listen();
  keyboardInputEvent.listen();
  puzzleAnalysis.listen();

  render.run();

  showTreeButton.addEventListener('click', () => {
    if(showTreeButton.innerText !== 'Show Puzzle') {
      treeView.draw();
      showTreeButton.innerText = "Show Puzzle";
    }
    else {
      showTreeButton.innerText = "Show Tree";
      document.getElementById('content').style.display = 'flex';
      document.getElementById('tree-view').style.display = 'none';
    }
  });

  solveButton.addEventListener('click', () => {
    const puzzleStatus = document.getElementById('puzzle-status').childNodes[1];
    puzzleStatus.style.color = 'var(--background-black)';
    puzzleStatus.innerText = "Loading...";
    
    socket.io.emit('execute', {
      "board": puzzle.getState().board,
      "position": puzzle.getState().position,
      "algorithm": algorithmSelect.value,
      "assessment-function": assessmentFunctionSelect.value
    });

    showTreeButton.style.display = 'block';
  });

  shuffleButton.addEventListener('click', () => {
    const numberToShuffle = document.getElementById('number-to-shuffle');
    const moves = ['moveToUp', 'moveToRight', 'moveToDown', 'moveToLeft'];

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

    for(let index = 0; index < numberToShuffle.value; index++) {
      const randomMoviment = Math.floor(Math.random()*4);
      puzzle[moves[randomMoviment]]();
    }
  });

  configShuffleButton.addEventListener('click', () => {
    const configContainer = document.getElementById('config-container');
    const configShuffleInput = document.getElementById('config-shuffle-input');
    const config = configShuffleInput.value;

    for(let i = 0; i < config.length; i++) {
      const number = parseInt(config[i]);
      puzzle.getState().board[i] = number;
      if(number === 0) {
        puzzle.getState().position = i;
      }
    }

    configContainer.style.display = 'none';
  });
}

document.addEventListener('keydown', event => {
  if(event.key === 'c') {
    const configContainer = document.getElementById('config-container');
    configContainer.style.display = configContainer.style.display === 'none' ? 'flex' : 'none';
  }
});

document.addEventListener('DOMContentLoaded', main);

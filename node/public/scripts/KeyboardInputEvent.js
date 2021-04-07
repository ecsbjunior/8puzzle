function KeyboardInputEvent(puzzle) {
  function listen() {
    document.addEventListener('keydown', (event) => {
      const move = {
        ArrowUp: () => {
          puzzle.moveToUp();
        },
        ArrowRight: () => {
          puzzle.moveToRight();
        },
        ArrowDown: () => {
          puzzle.moveToDown();
        },
        ArrowLeft: () => {
          puzzle.moveToLeft();
        }
      };

      try {
        move[event.key]();
      }
      catch (err) { }
    });
  }

  return {
    listen
  };
}

export default KeyboardInputEvent;

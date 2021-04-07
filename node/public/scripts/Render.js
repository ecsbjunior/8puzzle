function Render(puzzle) {
  const state = {
    canvas: document.getElementById('puzzle'),
    ctx: document.getElementById('puzzle').getContext('2d'),
    scaleX: 1.0,
    scaleY: 1.0,
    stroke: 1,
    shift: false,
    mousedown: false
  };

  state.canvas.width = 400;
  state.canvas.height = 400;

  function run() {
    const screen = {
      x: state.stroke-1,
      y: state.stroke-1,
      width: state.canvas.width/3,
      height: state.canvas.height/3
    };
    
    state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);

    for (const index in puzzle.getState().board) {
      const item = puzzle.getState().board[index];

      if (!item) {
        state.ctx.strokeStyle = 'rgb(103, 228, 116)';
        state.ctx.lineWidth = state.stroke;
        state.ctx.strokeRect(screen.x, screen.y, screen.width, screen.height);
      }
      else {
        state.ctx.strokeStyle = 'rgb(71, 194, 225)';
        state.ctx.lineWidth = state.stroke;
        state.ctx.strokeRect(screen.x, screen.y, screen.width, screen.height);
        state.ctx.font = "64px Consolas";
        state.ctx.fillStyle = "white";
        state.ctx.textAlign = 'center';
        state.ctx.textBaseline = 'middle';
        state.ctx.fillText(item, screen.x + screen.width / 2, screen.y + screen.height / 2);
      }

      screen.x += screen.width;
      if ((index + 1) % 3 === 0) {
        screen.x = state.stroke - 1;
        screen.y += screen.height;
      }
    }

    state.ctx.stroke();

    requestAnimationFrame(() => run());
  }

  // state.canvas.addEventListener('mousedown', () => {
  //   state.mousedown = true;
  // });
  
  // state.canvas.addEventListener('mousemove', () => {
  //   if(state.mousedown) {
  //     state.canvas.style.position = "absolute";
  //     state.canvas.style.top = "10px";
  //     state.canvas.style.left = "10px";
  //   }
  // });

  // state.canvas.addEventListener('mouseup', () => {
  //   state.mousedown = false;
  // });

  document.addEventListener('wheel', event => {
    if(state.shift) {
      // if(event.deltaY > 0) {
      //   state.ctx.scale(state.scaleX + 0.1, state.scaleY + 0.1);
      // }
      // else {
      //   state.ctx.scale(state.scaleX - 0.1, state.scaleY - 0.1);
      // }
    }
  });

  document.addEventListener('keydown', event => {
    if(event.key === 'Shift') {
      state.shift = true;
    }
  });

  document.addEventListener('keyup', event => {
    if(event.key === 'Shift') {
      state.shift = false;
    }
  });

  return {
    run
  };
}

export default Render;

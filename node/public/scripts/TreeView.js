// import vis from 'vis';

function TreeView(puzzleAnalysis) {
  const state = {
    element: document.getElementById('tree-view'),
    network: null
  };

  function draw() {
    const data = {
      nodes: puzzleAnalysis.getState().solution.map((node, index) => {
        return {
          id: index,
          label: node.board.map((item, index) => item+(((index+1)%3 === 0) ? '\n' : ' ')).join(''),
          borderWidth: 3,
          margin: {
            top: 16,
            bottom: 16,
            left: 30,
            right: 0
          },
          color: {
            background: 'rgb(19, 17, 27)',
            border: 'rgb(71, 194, 225)',
            highlight: {
              border: 'rgb(71, 194, 225)',
              background: 'rgb(19, 17, 27)',
            },
          },
          font: {
            color: 'rgb(170, 170, 170)',
            size: 16,
            align: 'center'
          },
          shape: 'circle'
        };
      }),
      edges: puzzleAnalysis.getState().solution.map((node, index) => {
        return {
          id: index,
          from: index,
          to: index + 1,
          color: {
            color: 'rgb(170, 170, 170)'
          }
        };
      })
    };
    var options = {
      layout: {
        hierarchical: {
          direction: 'UD',
          sortMethod: 'directed',
          levelSeparation: 150,
          nodeSpacing: 100,

        }
      },
      // interaction: { dragNodes: false },
      // physics: {
      //   enabled: false
      // },
      // configure: {
      //   filter: function (option, path) {
      //     if (path.indexOf('hierarchical') !== -1) {
      //       return true;
      //     }
      //     return false;
      //   },
      //   showButton: false
      // }
    };

    state.network = new vis.Network(state.element, data, options);

    document.getElementById('content').style.display = 'none';
    state.element.style.display = 'block';
  }

  return {
    draw
  };
}

export default TreeView;

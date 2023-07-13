class eah extends Player {
  constructor(name) {
    super(name);
    this.name = 'eah';
    this.memo = new Map();
  }

  makeMove(gameState, move) {
    let myTurn = gameState.whoseTurn();

    class MMNode {
      constructor(gameState, alpha, beta, isMax, memo) {
        this.gs = gameState;
        this.alpha = alpha;
        this.beta = beta;
        this.isMax = isMax;
        this.memo = memo;
      }

      alphabeta(depth) {
        if (depth === 0) {
          return this.score();
        }

        let validMoves = this.gs.getValidMoves();
        for (let vm of validMoves) {
          if (this.alpha >= this.beta) {
            break;
          }

          // Make a copy of the game state and make a move on it
          let newGameState = this.gs.deepCopy();
          newGameState.makeMove(vm);

          // Create a child MMNode appropriately
          let child = new MMNode(newGameState, this.alpha, this.beta, !this.isMax, this.memo);

          // Run alphabeta with depth-1
          let rtn = child.alphabeta(depth - 1);

          // Use the return value to change alpha or beta correctly
          if (this.isMax) {
            if (rtn > this.alpha) {
              this.alpha = rtn;
            }
          } else {
            if (rtn < this.beta) {
              this.beta = rtn;
            }
          }
        }

        // Return the correct value based on whether it's a minimizer or maximizer
        if (this.isMax) {
          return this.alpha;
        } else {
          return this.beta;
        }
      }

      score() {
        let stateKey = JSON.stringify(this.gs);
        if (this.memo.has(stateKey)) {
          return this.memo.get(stateKey);
        }

        // Calculate the score using your heuristic function
        let score = this.heuristicFunction();

        // Store the computed score in the memoization cache
        this.memo.set(stateKey, score);

        return score;
      }

      heuristicFunction() {
        // Implement your heuristic function here
        // Calculate and return the score for the current game state
        // Use any dynamic programming techniques or memoization as needed

        return 0; // Replace with your calculated score
      }
    }

    // Set up for the root
    let alpha = Number.NEGATIVE_INFINITY;
    let beta = Number.POSITIVE_INFINITY;
    let maxDepth = 2;

    let vms = gameState.getValidMoves();
    for (let vm of vms) {
      // Copy the game state and make a move
      let newGS = gameState.deepCopy();
      newGS.makeMove(vm);

      // Make an MMNode appropriately and run alphabeta on it
      let child = new MMNode(newGS, alpha, beta, true, this.memo);
      let rtn = child.alphabeta(maxDepth);

      if (rtn > alpha) {
        alpha = rtn;

        // Clear the array
        move.length = 0;

        // Copy the valid move into move
        for (let m of vm) {
          move.push(m);
        }
      }
    }
  }
}

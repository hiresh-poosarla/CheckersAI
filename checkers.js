class eah extends PlayerAI{
    constructor(name){
        super(name);
        this.name = 'eah';


    }
    makeMove(gamestate, moves) {
        if (gamestate.isGameOver()) {
          return [];
        }
        
        let bestMove = this.minimax(gamestate, 4, true);
        for (let move of bestMove.moves) {
          moves.push(move);
        }
        return bestMove.moves;
      }
    
      evaluateBoard(gamestate) {
        const aiPlayer = this.name;
        const opponentPlayer = (aiPlayer === 'Player 1') ? 'Player 2' : 'Player 1';
      
        let aiScore = 0;
        let opponentScore = 0;
      
        // Calculate the score based on the number of pieces for each player
        getScore( player )
        
      
        // Return the score difference (maximize for AI player)
        return aiScore - opponentScore;
      }

      minimax(gamestate, depth, maximizingPlayer, alpha = -Infinity, beta = Infinity) {
        if (depth === 0 || gamestate.isGameOver()) {
          // Return the evaluation score if we've reached the maximum depth or the game is over
          return { score: this.evaluateBoard(gamestate), moves: [] };
        } 
    
        let validMoves = gamestate.getValidMoves();
        let bestMove;
        if (maximizingPlayer) {
          // Maximize the score
          let maxScore = -Infinity;
          for (let move of validMoves) {
            let nextState = gamestate.applyMove(move);
            let result = this.minimax(nextState, depth - 1, false, alpha, beta);
            if (result.score > maxScore) {
              maxScore = result.score;
              bestMove = move;
            }
            alpha = Math.max(alpha, maxScore);
            if (beta <= alpha) {
              // Perform alpha-beta pruning
              break;
            }
          }
          return { score: maxScore, moves: [bestMove, ...result.moves] };
        } else {
          // Minimize the score
          let minScore = Infinity;
          for (let move of validMoves) {
            let nextState = gamestate.applyMove(move);
            let result = this.minimax(nextState, depth - 1, true, alpha, beta);
            if (result.score < minScore) {
              minScore = result.score;
              bestMove = move;
            }
            beta = Math.min(beta, minScore);
            if (beta <= alpha) {
              // Perform alpha-beta pruning
              break;
            }
          }
          return { score: minScore, moves: [bestMove, ...result.moves] };
        }
      }
    
}



class eah extends Player{
    constructor(name){
        super(name);
        this.name = 'eah';


    }
    makeMove( gameState, move ){
        let myTurn = gameState.whoseTurn();

        class MMNode {
            constructor(gameState, alpha, beta, isMax){
                this.gs = gameState;
                this.alpha = alpha;
                this.beta = beta;
                this.isMax = isMax;
            }

            alphabeta( depth ){
                if( depth === 0 ){
                    return this.score();
                }

                let validMoves = this.gs.getValidMoves();
                for( let vm of validMoves ){
                    if( this.alpha >= this.beta ){ break; }
                    
                    // Make a copy of the gamestate and make a move on it
                    let newGameState = this.gs.deepCopy();
                    newGameState.makeMove(vm);

                    // Create a child MMNode appropriately
                    let child = new MMNode(newGameState, this.alpha, this.beta, !this.isMax);

                    // run alphabeta with depth-1
                    let rtn = child.alphabeta(depth - 1);

                    // use the return to change alpha or beta correctly
                    if( this.isMax ){
                        if( rtn > this.alpha ){
                            this.alpha = rtn;
                        }
                    }
                    else {
                        if( rtn < this.beta ){
                            this.beta = rtn;
                        }
                    }
                }

                // Return the correct value based on me being a minimizer of maximizer
                if( this.isMax ){
                    return this.alpha;
                }
                else {
                    return this.beta;
                }

            }

            score(){
                return this.gs.getScore(myTurn);
            }
        }

        // Set up for the root
        let alpha = Number.NEGATIVE_INFINITY;
        let beta = Number.POSITIVE_INFINITY;
        let maxDepth = 2;

        let vms = gameState.getValidMoves();
        for( let vm of vms ){

            // copy the gamestate and make a move
            let newGS = gameState.deepCopy();
            newGS.makeMove( vm );

            // Make an MMNode appropriately and run alphabeta on it
            let child = new MMNode(newGS, alpha, beta, true);
            let rtn = child.alphabeta(maxDepth);


            if( rtn > alpha ){
                alpha = rtn;

                // clear the array
                move.length = 0;

                // Copy the valid move into move
                for( let m of vm ){
                    move.push(m);
                }
            }

        }
    }
    
}

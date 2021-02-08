const schema = require('@colyseus/schema');
const ChessPlayer = require('./ChessPlayer');
const {Chess} = require('chess.js')

class GameState extends schema.Schema {
  constructor() {
    super();
    this.chessGame = new Chess();
    this.whitePlayer = null;
    this.blackPlayer = null;
    this.fen = this.chessGame.fen();
  }

  getColorOfPlayer(sessionId) {
    if (this.whitePlayer.sessionId === sessionId) {
      return "w";
    }
    if (this.blackPlayer.sessionId === sessionId) {
      return "b";
    }

    return null;
  }

}

schema.defineTypes(GameState, {
  fen: 'string',
  whitePlayer: ChessPlayer,
  blackPlayer: ChessPlayer
});

module.exports = GameState;
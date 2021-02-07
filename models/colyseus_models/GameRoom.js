const colyseus = require('colyseus');

const GameState = require('./GameState')
const ChessPlayer = require('./ChessPlayer');

class GameRoom extends colyseus.Room {
    // When room is initialized
    onCreate (options) {
        this.setState(new GameState());

        this.onMessage("move", (client, move) => {
            if (this.state.getColorOfPlayer(client.sessionId) === this.state.chessGame.turn()) {
                let boardChange = this.state.chessGame.move({
                    from: move.source,
                    to: move.target,
                    promotion: 'q' // NOTE: always promote to a queen for example simplicity
                });

                this.state.fen = this.state.chessGame.fen();

                if (boardChange == null) {
                    client.send('error', 'illegal move');
                }
            }
        });

        this.onMessage("whatIsMyColor", (client, move) => {
           client.send('yourColor', this.state.getColorOfPlayer(client.sessionId));
        });
    }

    // Authorize client based on provided options before WebSocket handshake is complete
    onAuth (client, options, request) {
        const color = options.color;
        if (color === "b") {
            if (this.state.blackPlayer != null)
                return false;
            this.state.blackPlayer = new ChessPlayer(client.sessionId, color);
        }
        else if (color === "w") {
            if (this.state.whitePlayer != null)
                return false;
            this.state.whitePlayer = new ChessPlayer(client.sessionId, color);
        } else {
            if (this.state.whitePlayer == null)
                this.state.whitePlayer = new ChessPlayer(client.sessionId, "w");
            else if (this.state.blackPlayer == null)
                this.state.blackPlayer = new ChessPlayer(client.sessionId, "b");
            else
                return false;
        }
        return true;
    }

    // When client successfully join the room
    onJoin (client, options, auth) {

    }

    // When a client leaves the room
    onLeave (client, consented) { }

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose () { }
}

module.exports = GameRoom;
const schema = require('@colyseus/schema');

class ChessPlayer extends schema.Schema {
    constructor(sessionId, name) {
        super();
        this.sessionId = sessionId;
        this.name = name;
    }
}
schema.defineTypes(ChessPlayer, {
    sessionId: "string",
    name: "string"
});


module.exports = ChessPlayer;
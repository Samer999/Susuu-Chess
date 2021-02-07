function createGame(color, roomId) {
    var myColor = color;
    var board = null;
    var game = new Chess();
    var $status = $('#status');
    var $fen = $('#fen');
    var $pgn = $('#pgn');
    var myRoom = null;
    const client = new Colyseus.Client('ws://localhost:3002');
    if (roomId) {
        client.joinById(roomId).then(room => {
            console.log('joined a room');
            room.send('whatIsMyColor');
            room.onMessage('yourColor', (color) => {
                myColor = color;
            });
            room.onStateChange((state) => {
                console.log(state);
                game.load(state.fen);
                board.position(state.fen);
            });
            myRoom = room;
        });
    } else {
        client.create("chessGame", {color}).then(room => {
            console.log('created and joined a room');
            console.log(`room id is ${room.id}`);
            room.onStateChange((state) => {
                console.log(state);
                game.load(state.fen);
                board.position(state.fen);
            });
            myRoom = room;
        });
    }

    function onDragStart(source, piece, position, orientation) {
        // do not pick up pieces if the game is over
        if (game.game_over()) return false;

        if (game.turn() != myColor) {
            return false;
        }


        // only pick up pieces for the side to move
        if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false
        }
    }

    function onDrop(source, target) {
        // see if the move is legal
        var move = game.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        })

        // illegal move
        if (move === null) return 'snapback'

        myRoom.send("move", {source, target});

        updateStatus()
    }

    // update the board position after the piece snap
    // for castling, en passant, pawn promotion
    function onSnapEnd() {
        board.position(game.fen())
    }

    function updateStatus() {
        var status = ''

        var moveColor = 'White'
        if (game.turn() === 'b') {
            moveColor = 'Black'
        }

        // checkmate?
        if (game.in_checkmate()) {
            status = 'Game over, ' + moveColor + ' is in checkmate.'
        }

        // draw?
        else if (game.in_draw()) {
            status = 'Game over, drawn position'
        }

        // game still on
        else {
            status = moveColor + ' to move'

            // check?
            if (game.in_check()) {
                status += ', ' + moveColor + ' is in check'
            }
        }

        $status.html(status)
        $fen.html(game.fen())
        $pgn.html(game.pgn())
    }

    var config = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd,
        orientation: (myColor === 'w' ? "white" : "black")
    }
    board = Chessboard('myBoard', config)
}
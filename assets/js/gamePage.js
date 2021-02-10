function gamePage(color, roomId, isSpectator) {
  let myColor = color;
  let board = null;
  let game = new Chess();
  let $status = $('#status');
  let $fen = $('#fen');
  let $pgn = $('#pgn');
  let myRoom = null;


  if(isSpectator === true) {
    setRole('S');
  } else {
    setRole(myColor);
  }

  function setUpBoard() {
    let config = {
      draggable: true,
      position: 'start',
      onDragStart: onDragStart,
      onDrop: onDrop,
      onSnapEnd: onSnapEnd,
      orientation: (myColor === 'w' ? "white" : "black")
    }
    board = Chessboard('myBoard', config)
  }

  const client = new Colyseus.Client('ws://localhost:3000');
  if (roomId) {
    client.joinById(roomId, {isSpectator}).then(room => {
      if (!isSpectator) {
        room.send('whatIsMyColor');
        room.onMessage('yourColor', (color) => {
          myColor = color;
          setUpBoard();
        });
      }
      room.onStateChange((state) => {
        game.load(state.fen);
        board.position(state.fen);
      });
      myRoom = room;
      setRoomId(room.id);
    });
  } else {
    client.create("chessGame", {color}).then(room => {
      room.onStateChange((state) => {
        game.load(state.fen);
        board.position(state.fen);
      });
      myRoom = room;
      setRoomId(room.id);
    });
  }

  function onDragStart(source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (game.game_over()) {
      return false;
    }

    // spectators can't move pieces
    if (isSpectator) {
      return false;
    }

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
    if (move === null) {
      return 'snapback'
    }

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

  function setRole(role) {
    let status = ""; ;
    switch(role) {
      case 'w':
        status = 'You are Playing As White';
        break;

      case 'b':
        status = 'You are Playing As Black';
        break;
      case 'S':
        status = 'You are Spectating this match';
        break;
      default:
        status = 'Thanks for being there';
    }

    document.querySelector('#joinerStatus').innerText = status;
  }

  function setRoomId(roomId) {
    document.querySelector('#gameId').innerText = roomId;
  }
  setUpBoard();
}


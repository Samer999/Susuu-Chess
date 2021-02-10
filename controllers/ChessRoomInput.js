class ChessRoomInput {
  constructor(color, roomId, isSpectator) {
    this.color = color;
    this.roomId = roomId;
    this.isSpectator = isSpectator;
  }
}

module.exports = ChessRoomInput;
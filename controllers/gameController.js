const url = require('url');

const ChessRoomInput = require('./ChessRoomInput');

const {urls, fullUrlWithPrefix} = require('../constants/urls/gameUrls');

module.exports.createGame = (req, res) => {
  let color = req.query.color;
  let chessRoomInput = new ChessRoomInput(color);
  res.redirect(url.format({
    pathname: fullUrlWithPrefix(urls.GAME_PAGE_URL),
    query: chessRoomInput
  }));
}

module.exports.joinGame = (req, res) => {
  let color = "w"; // default value
  let roomId = req.query.roomId;
  let isSpectator = req.query.actor === "spectator";
  let chessRoomInput = new ChessRoomInput(color, roomId, isSpectator);
  res.redirect(url.format({
    pathname: fullUrlWithPrefix(urls.GAME_PAGE_URL),
    query: chessRoomInput
  }));
}

module.exports.gamePage = (req, res) => {
  res.render("game-page", req.query);
}
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const {createServer} = require('http');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const {Server} = require('colyseus');

const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');

const {checkUser, requireAuth} = require('./middlewares/authMiddleware');
const mongooseConnect = require('./databases/mongooseConnect');
const ChatRoom = require('./models/colyseus_models/ChatRoom');
const GameRoom = require('./models/colyseus_models/GameRoom');

const {urls} = require('./constants/urls/gameUrls');

const app = express();

// Attach WebSocket Server on HTTP Server.
const gameServer = new Server({
  server: createServer(app),
  express: app,
  pingInterval: 0,
});

gameServer.define("chat", ChatRoom);
gameServer.define("chessGame", GameRoom);

// view engine
app.set('view engine', 'ejs');

// start listing if database connected
mongooseConnect(mongoose).then(() => {
  gameServer.listen(process.env.PORT);
}).catch((err) => {
  console.log(err);
});

// middleware
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(checkUser);

app.use(urls.GAME_ROUTE_PREFIX, gameRoutes);

// home page
app.get('/', (req, res) => {
  res.render('home');
})

// public global chat
app.get('/global-chat', (req, res) => {
  res.render('global-chat');
});

// auth routes
app.use(authRoutes);

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const {createServer} = require('http');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { Server, LobbyRoom, RelayRoom } = require('colyseus');

const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');

const {checkUser, requireAuth} = require('./middlewares/authMiddleware');
const mongooseConnect = require('./databases/mongooseConnect');
const ChatRoom = require('./models/colyseus_models/ChatRoom');
const GameRoom = require('./models/colyseus_models/GameRoom');

const {GAME_ROUTE_PREFIX} = require('./constants/urls/gameUrls');

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
    app.listen(process.env.SERVER_PORT);
    gameServer.listen(process.env.COLYSEUS_PORT);
}).catch((err) => {
    console.log(err);
});

// middleware
app.use(express.static('assets'));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(checkUser);

app.use(GAME_ROUTE_PREFIX, gameRoutes);


// home page
app.get('/', (req, res) => {
    res.render('home');
})

// public global chat
app.get('/global-chat', (req, res) => {
    res.render('global-chat');
});

app.post('/create-game', (req, res) => {
    var color = req.body.color;
    var roomId;
    res.render('create-game-page', {color, roomId});
});

app.post('/join-game', (req, res) => {
    var roomId = req.body.roomId;
    var color = {};
    res.render('create-game-page', {color, roomId});
});

// auth routes
app.use(authRoutes);

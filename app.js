require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const {checkUser, requireAuth} = require('./middlewares/authMiddleware');
const mongooseConnect = require('./databases/mongooseConnect');


const app = express();

// view engine
app.set('view engine', 'ejs');

// start listing if database connected
mongooseConnect(mongoose).then(() => {
    app.listen(process.env.SERVER_PORT);
}).catch((err) => {
    console.log(err);
});

// middleware
app.use(express.static('assets'));
app.use(express.json());
app.use(cookieParser());
app.use(checkUser);

// check if user signed in
app.get('*', checkUser);

// home page
app.get('/', (req, res) => {
    res.render('home');
})

app.get('/game', (req, res) => {
    res.render('match-page');
})

// auth routes
app.use(authRoutes);

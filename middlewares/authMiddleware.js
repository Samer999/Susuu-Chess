const jwt = require('jsonwebtoken');
const authUrls = require('../constants/urls/authUrls');
const User = require('../models/User');

const checkUser = (req, res, next) => {
  const token = req.cookies[process.env.JWT_AUTH];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRETE_KEY,
        async (err, decodedToken) => {
          if (err) {
            res.locals.user = null;
            next();
          } else {
            let user = await User.findById(decodedToken.id);
            res.locals.user = user;
            next();
          }
        });
  } else {
    res.locals.user = null;
    next();
  }
}

const requireAuth = (req, res, next) => {
  const token = req.cookies[process.env.JWT_AUTH];
  // check json web exist & is valid
  if (token) {
    jwt.verify(token, process.env.JWT_SECRETE_KEY, (err, decodedToken) => {
      if (err) {
        res.redirect(authUrls.SIGN_IN_URL);
      } else {
        next();
      }
    });
  } else {
    res.redirect(authUrls.SIGN_IN_URL);
  }
}

module.exports = {requireAuth, checkUser};
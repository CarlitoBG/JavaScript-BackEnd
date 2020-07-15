const models = require('../models');
const utils = require('../utils');
const appConfig = require('../app-config');

function login(req, res) {
  const { user } = req;
    if (user) {
        res.redirect('/');
        return;
    }
    res.render('login.hbs');
}

function loginPost(req, res, next) {
  const { username, password } = req.body;
  models.userModel.findOne({ username }).then(user => 
      Promise.all([user, user.matchPassword(password)])).then(([user, match]) => {
        if (!match) {
          res.render('login.hbs', { message: 'Wrong password or username!' });
          return;
        }
        const token = utils.jwt.createToken({ id: user._id });
        res.cookie(appConfig.authCookieName, token).redirect('/');
    }).catch(err => {
      if (['Cannot read property \'matchPassword\' of null'].includes(err.message)) {
        res.render('login.hbs', { message: 'Wrong password or username!' });
        return;
      }
      next(err);
  });
}

function register(req, res) {
  const { user } = req;
    if (user) {
        res.redirect('/');
        return;
    }
  res.render('register.hbs');
}

function registerPost(req, res, next) {
  const { username, password, repeatPassword } = req.body;
  if (password !== repeatPassword) {
    res.render('register.hbs', { errors: { repeatPassword: 'Password and repeat password don\'t match!'}});
    return;
  }

  return models.userModel.create({ username, password }).then(() => {
    res.redirect('/login');
  }).catch(err => {
    if (err.name === 'MongoError' && err.code === 11000) {
      res.render('register.hbs', { errors: { username: 'Username already taken!'}});
      return;
    }
    next(err);
  });
}

function logout(req, res) {
  const token = req.cookies[appConfig.authCookieName];
  models.tokenBlacklistModel.create({ token }).then(() => {
    res.clearCookie(appConfig.authCookieName).redirect('/');
  });
}

module.exports = {
  login,
  loginPost,
  register,
  registerPost,
  logout
};
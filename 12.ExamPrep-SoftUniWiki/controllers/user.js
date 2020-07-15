const models = require('../models');
const utils = require('../utils');
const config = require('../config/config');

module.exports = {
  get: {
    login: function (req, res) {
      const { user } = req;
        if (user) {
            res.redirect('/');
            return;
        }
        res.render('user/login');
    },
    register: function (req, res) {
      const { user } = req;
        if (user) {
            res.redirect('/');
            return;
        }
      res.render('user/register');
    },
    logout: function (req, res) {
      res.clearCookie(config.cookie).redirect('/');
    }
  },
  post: {
    login: function (req, res, next) {
      const { username, password } = req.body;

      models.userModel.findOne({ username }).then(user => 
          Promise.all([user, user.matchPassword(password)])).then(([user, match]) => {
            if (!match) {
              res.render('user/login', { errorMessage: ['Wrong password or username!'] });
              return;
            }

            const token = utils.jwt.createToken({ id: user._id });
            res.cookie(config.cookie, token).cookie('username', user.username).redirect('/');
        }).catch((err) => {
          if (['Cannot read property \'matchPassword\' of null'].includes(err.message)) {
            res.render('user/login', { errorMessage: 'Wrong password or username!' });
            return;
          }
          next(err);
        });
    },
    register: function (req, res, next) {
      const { username, password } = req.body;
      const repeatPassword = req.body['repeat-password'];

      if (password !== repeatPassword) {
        res.render('user/register', { errorMessages: ['Both passwords should be equal ...'] });
        return;
      }

      return models.userModel.create({ username, password }).then(() => {
        res.redirect('/user/login');
      }).catch((err) => {
          if (err.name === 'MongoError') {
            res.render('user/register', { errorMessages: ['User already exists!'] });
            return;
          }else if(err.name === 'ValidationError') {
            const errorMessages = Object.entries(err.errors).map(tuple => {
              return tuple[1].message;
            });

            res.render('user/register', { errorMessages });
            return;
          }
     
          next(err);
      });
    }
  },
};
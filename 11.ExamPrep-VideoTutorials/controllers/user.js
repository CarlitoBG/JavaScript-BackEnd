const models = require('../models');
const utils = require('../utils');
const config = require('../config/config');
const { validationResult } = require('express-validator');

module.exports = {
  get: {
    login: function (req, res) {
      const { user } = req;
        if (user) {
            res.redirect('/home/');
            return;
        }
        res.render('login.hbs', { pageTitle: 'Login Page' });
    },
    register: function (req, res) {
      const { user } = req;
        if (user) {
            res.redirect('/home/');
            return;
        }
      res.render('register.hbs', { pageTitle: 'Register Page' });
    },
    logout: function (req, res) {
      res.clearCookie(config.cookie).redirect('/home');
    }
  },
  post: {
    login: function (req, res, next) {
      const { username, password } = req.body;
      models.userModel.findOne({ username }).then(user => 
          Promise.all([user, user.matchPassword(password)])).then(([user, match]) => {
            if (!match) {
              res.render('login.hbs', { message: 'Wrong password or username!' });
              return;
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render('login.hbs', {
                    message: errors.array()[0].msg,
                });
            }

            const token = utils.jwt.createToken({ id: user._id });
            res.cookie(config.cookie, token).redirect('/home/');
        }).catch(err => {
          if (['Cannot read property \'matchPassword\' of null'].includes(err.message)) {
            res.render('login.hbs', { message: 'Wrong password or username!' });
            return;
          }
          next(err);
      });
    },
    register: function (req, res, next) {
      const { username, password, repeatPassword } = req.body;
      if (password !== repeatPassword) {
        res.render('register.hbs', { message: 'Password and repeat password don\'t match!'});
        return;
      }
    
      const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('register.hbs', {
                message: errors.array()[0].msg,
            });
        }

      return models.userModel.create({ username, password }).then(() => {
        res.redirect('/user/login');
      }).catch(err => {
        if (err.name === 'MongoError' && err.code === 11000) {
          res.render('register.hbs', { message: 'Username already taken!'});
          return;
        }
        next(err);
      });
    }
  },
};
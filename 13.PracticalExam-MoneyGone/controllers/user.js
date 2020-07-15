const models = require('../models');
const utils = require('../utils');
const config = require('../config/config');
const { validationResult } = require('express-validator');

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
    },
    accountInfo: function (req, res) {
      const user = req.user;

      models.expenseModel.find().where('user').equals(user._id).lean().then((expenses) => {
        res.render('expenses/account-info', {
          user,
          totalAmount: expenses.reduce(function (a, b) { return a + b.total; }, 0),
          totalMerches: expenses.length,
          availableAmount: (user.amount).toFixed(2)
        });
      });
    }
  },
  post: {
    login: function (req, res, next) {
      const { username, password } = req.body;

      models.userModel.findOne({ username }).then(user => 
          Promise.all([user, user.matchPassword(password)])).then(([user, match]) => {
            if (!match) {
              res.render('user/login', { message: 'Wrong password or username!' });
              return;
            }

            const token = utils.jwt.createToken({ id: user._id });
            res.cookie(config.cookie, token).cookie('username', user.username).redirect('/');
        }).catch((err) => {
          if (['Cannot read property \'matchPassword\' of null'].includes(err.message)) {
            res.render('user/login', { message: 'Wrong password or username!' });
            return;
          }
          next(err);
        });
    },
    register: function (req, res, next) {
      const { username, password, repeatPassword, amount } = req.body;
    
      if (password !== repeatPassword) {
        res.render('user/register', { message: 'Both passwords should be equal!' });
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.render('user/register', {
              message: errors.array()[0].msg,
              oldBody: req.body
          });
      }

      return models.userModel.create({ username, password, amount: amount === '' ? undefined : amount }).then(() => {
        res.redirect('/user/login');
      }).catch((err) => {
          if (err.name === 'MongoError') {
            res.render('user/register', { message: 'User already exists!' });
            return;
          }
     
          next(err);
      });
    },
    refill: function(req, res){
      const { refill } = req.body;
      const user = req.user;

      models.expenseModel.find().where('user').equals(user._id).lean().then((expenses) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('expenses/expenses', {
                message: errors.array()[0].msg,
                user,
                expenses
            });
        }

        return models.userModel.findByIdAndUpdate(user._id, {amount: user.amount + Number(refill)}).then(() => {
          res.redirect('/');
        });
      });
    }
  }
};
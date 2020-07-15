const models = require('../models');
const { validationResult } = require('express-validator');

module.exports = {
  get: {
    create: function (req, res) {
      const user = req.user;
      if(!user){
        res.redirect('/user/login');
      }
      res.render('expenses/create', { user });
    },
    report: function(req, res) {
      const expenseId = req.params.id;
      const user = req.user;

      models.expenseModel.findById(expenseId).lean().then((expense) => {
          res.render('expenses/report', { user, expense });
        })
    },
    delete: function(req, res) {
      const expenseId = req.params.id;

      models.expenseModel.findByIdAndRemove(expenseId).then(() => {
        res.redirect('/');
      })
    }
  },
  post: {
    create: function (req, res, next) {
      const user = req.user;
      const { merchant, total, category, description, report } = req.body;
      const isReported = report !== undefined ? true : false;

      if(total > user.amount){
        return res.render('expenses/create', {
          user,
          message: 'Your account amount is insufficient! Please refill first!',
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.render('expenses/create', {
              user,
              message: errors.array()[0].msg,
              oldBody: req.body
          });
      }

      models.expenseModel.create({ merchant, total, category, description, report: isReported, user: user._id }).then((expenseData) => {
        user.expenses.push(expenseData._id);
        user.amount = user.amount - total;
        return models.userModel.findByIdAndUpdate({ _id: user._id }, user);
      }).then(() => {
        res.redirect('/');
      }).catch(next);
    }
  }
};
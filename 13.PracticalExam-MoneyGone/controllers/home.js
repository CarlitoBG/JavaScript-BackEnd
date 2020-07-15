const models = require('../models');

module.exports = {
  get: {
    home: function (req, res) {
        const user = req.user;

        if(user){
          Promise.all([
            models.userModel.findById(user._id),
            models.expenseModel.find({}).lean().where('user').equals(user._id)
          ]).then(([user, expenses]) => {
            res.render('expenses/expenses', { user, expenses });
          })
        }else {
          res.render('home');
        }
    }
  }
};
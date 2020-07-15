const models = require('../models');

module.exports = {
  get: {
    home: function (req, res) {
      models.articleModel.find().lean().sort({ creationDate: -1 }).limit(3).then((articles) => {
        articles.forEach(a => {
          a.description = a.description.split(' ').slice(0, 50).join(' ');
        });

        res.render('homePage', { articles });
      })
    }
  }
};
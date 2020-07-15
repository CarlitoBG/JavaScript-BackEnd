const models = require('../models');
const { use } = require('../routers/user');

module.exports = {
  get: {
    create: function (req, res) {
      const user = req.user;
      if(!user){
        res.redirect('/user/login');
      }
      res.render('article/create');
    },
    all: function(req, res) {
      models.articleModel.find({}).lean().select('title').then((articles) =>  {
        res.render('article/all', { articles });
      })
    },
    details: function(req, res) {
      const articleId = req.params.id;

      models.articleModel.findById(articleId).lean().then((article) => {
          if(req.user){
            article.isAuthor = article.articleAuthor.toString() === req.user._id.toString();
          }
          article.paragraphs = article.description.split('\r\n\r\n');

          res.render('article/details', { article });
        })
    },
    edit: function(req, res) {
      const articleId = req.params.id;

      models.articleModel.findById(articleId).lean().then((article) => {
          res.render('article/edit', { article });
        })
    },
    delete: function(req, res) {
      const articleId = req.params.id;

      models.articleModel.findByIdAndRemove(articleId).then(() => {
        res.redirect('/article/all');
      })
    }
  },
  post: {
    create: function (req, res) {
      const { title, description } = req.body;

      models.articleModel.create({ title, description, articleAuthor: req.user._id }).then((articleData) => {
        req.user.createdArticles.push(articleData._id);
        return models.userModel.findByIdAndUpdate({ _id: req.user._id }, req.user)
      }).then(() => {
        res.redirect('/');
      }).catch((err) => {
        const errorMessages = Object.entries(err.errors).map(tuple => {
          return tuple[1].message;
        });

        res.render('article/create', { errorMessages });
      });
    },
    edit: function (req, res, next) {
      const { description } = req.body;
      const articleId = req.params.id;

      models.articleModel.findByIdAndUpdate(articleId, { description }, { runValidators: true }).then(() => {    
        res.redirect(`/article/details/${articleId}`);
      }).catch((err) => {
        const errorMessages = Object.entries(err.errors).map(tuple => {
          return tuple[1].message;
        });

        res.render('article/edit', { errorMessages });
      });
    },
    search: function(req, res) {
      const { search } = req.body;

      models.articleModel.find({}).lean().select('title').then((articles) => {
        const searchedArticles = articles.filter(a => 
          a.title.toLowerCase().includes(search.toLowerCase()));

        res.render('article/search', { articles: searchedArticles, search})
      });
    }
  }
};
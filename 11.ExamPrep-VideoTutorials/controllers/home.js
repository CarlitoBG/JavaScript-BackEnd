const models = require('../models');

module.exports = {
  get: {
    home: function (req, res) {
      const user = req.user;

      const { search } = req.query;
      let query = {};

      if(search){
          query = { ...query, title: { $regex: search, $options: 'i' } };
      }
      
      if(user){
          models.courseModel.find(query).lean().sort({ createdAt: -1 }).where('isPublic').equals(true).then(courses => {
            const hbsObject = {
              pageTitle: 'Home Page',
              isLoggedIn: true,
              username: user.username,
              search,
              courses
            };
            res.render('home.hbs', hbsObject);
          })
      }else{
          models.courseModel.aggregate([
            { '$match': { 'isPublic': true } },
            {
                '$project': {
                    'title': 1,
                    'isPublic': 1,
                    'description': 1,
                    'imageUrl': 1,
                    'creator': 1,
                    'createdAt': 1,
                    'users': { '$size': '$users' }
                }
            },
            { '$sort': { 'users': -1 } },
            { '$limit': 3 }
          ]).then(courses => {
              const hbsObject = {
                pageTitle: 'Home Page',
                isLoggedIn: false,
                courses
              };
              res.render('home.hbs', hbsObject);
              return;
          });
      }
    }
  }
};
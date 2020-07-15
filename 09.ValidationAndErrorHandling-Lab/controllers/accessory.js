const { accessoryModel, cubeModel } = require('../models');

module.exports = {
  get: {
    create: function (req, res) {
      const user = req.user;
      res.render('createAccessory.hbs', { user });
    },
    attach: function(req, res, next) {
      const { id: cubeId } = req.params;
      const user = req.user;
      cubeModel.findById(cubeId).then(cube => 
        Promise.all([cube, accessoryModel.find({ cubes: { $nin: cubeId } })])
      ).then(([cube, filterAccessories]) => {
        res.render('attachAccessory.hbs', { user, cube, accessories: filterAccessories.length > 0 ? filterAccessories : null});
      }).catch(next);
    }
  },
  post: {
    create: function (req, res, next) {
      const { name = null, description = null, imageUrl = null } = req.body;
      accessoryModel.create({ name, description, imageUrl })
        .then(() => { res.redirect('/'); })
        .catch(next);
    },
    attach: function (req, res, next) {
      const { id } = req.params;
      const { accessory: accessoryId } = req.body;
      Promise.all([
        cubeModel.update({ _id: id }, { $push: { accessories: accessoryId } }),
        accessoryModel.update({ _id: accessoryId }, { $push: { cubes: id } })
      ]).then(() => {
          res.redirect('/');
      }).catch(next);
    }
  }
};
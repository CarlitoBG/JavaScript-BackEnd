const cubeController = require('../controllers/cube');
const accessoryController = require('../controllers/accessory');
const authController = require('../controllers/auth');
const { auth } = require('../utils');

module.exports = (app) => {
    app.get('/create/accessory', auth(), accessoryController.get.create);
    app.post('/create/accessory', auth(), accessoryController.post.create);
    app.get('/attach/accessory/:id', auth(), accessoryController.get.attach);
    app.post('/attach/accessory/:id', auth(), accessoryController.post.attach);
    app.get('/details/:id', auth(false), cubeController.get.details)
    app.get('/about', auth(false), cubeController.get.about);
    app.get('/login', auth(false), authController.get.login);
    app.get('/register', auth(false), authController.get.register);
    app.post('/login', auth(false), authController.post.login);
    app.post('/register', auth(false), authController.post.register);
    app.get('/logout', auth(), authController.get.logout);
    app.get('/not-found', auth(false), cubeController.get.notFound);
    app.get('/create', auth(), cubeController.get.create);
    app.post('/create', auth(), cubeController.post.create);
    app.get('/edit/:id', auth(), cubeController.get.edit);
    app.post('/edit/:id', auth(), cubeController.post.edit);
    app.get('/delete/:id', auth(), cubeController.get.delete);
    app.post('/delete/:id', auth(), cubeController.post.delete);
    app.get('/', auth(false), cubeController.get.index);
    app.get('*',  auth(false), (req, res) => { res.render('404.hbs'); });
};
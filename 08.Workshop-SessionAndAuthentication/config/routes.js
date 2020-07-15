const cubeController = require('../controllers/cube');
const accessoryController = require('../controllers/accessory');
const authController = require('../controllers/auth');
const { auth } = require('../utils');

module.exports = (app) => {
    app.get('/create/accessory', auth(), accessoryController.createGet);
    app.post('/create/accessory', auth(), accessoryController.createPost);
    app.get('/attach/accessory/:id', auth(), accessoryController.attachGet);
    app.post('/attach/accessory/:id', auth(), accessoryController.attachPost);
    app.get('/details/:id', auth(false), cubeController.details)
    app.get('/about', auth(false), cubeController.about);
    app.get('/login', auth(false), authController.login);
    app.get('/register', auth(false), authController.register);
    app.post('/login', auth(false), authController.loginPost);
    app.post('/register', auth(false), authController.registerPost);
    app.get('/logout', auth(), authController.logout);
    app.get('/not-found', auth(false), cubeController.notFound);
    app.get('/create', auth(), cubeController.getCreate);
    app.post('/create', auth(), cubeController.postCreate);
    app.get('/edit/:id', auth(), cubeController.getEdit);
    app.post('/edit/:id', auth(), cubeController.postEdit);
    app.get('/delete/:id', auth(), cubeController.getDelete);
    app.post('/delete/:id', auth(), cubeController.postDelete);
    app.get('/', auth(false), cubeController.index);
    app.get('*',  auth(false), (req, res) => { res.render('404.hbs'); });
};
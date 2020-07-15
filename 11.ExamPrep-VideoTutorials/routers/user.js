const router = require('express').Router();
const controllers = require('../controllers');
const auth = require('../utils/auth');
const userValidator = require('../utils/userValidator');

router.get('/login', auth(false), controllers.user.get.login);

router.get('/register', auth(false), controllers.user.get.register);

router.get('/logout', auth(), controllers.user.get.logout);

router.post('/login', auth(false), controllers.user.post.login);

router.post('/register', auth(false), userValidator, controllers.user.post.register);

module.exports = router;
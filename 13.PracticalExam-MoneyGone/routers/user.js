const router = require('express').Router();
const controllers = require('../controllers');
const auth = require('../utils/auth');
const userValidator = require('../utils/userValidator');
const refillValidator = require('../utils/refillValidator');

router.get('/login', auth(false), controllers.user.get.login);

router.get('/register', auth(false), controllers.user.get.register);

router.get('/logout', auth(), controllers.user.get.logout);

router.post('/login', auth(false), controllers.user.post.login);

router.post('/register', auth(false), userValidator, controllers.user.post.register);

router.post('/refill', auth(), refillValidator, controllers.user.post.refill);

router.get('/account-info', auth(), controllers.user.get.accountInfo);

module.exports = router;
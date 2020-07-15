
const router = require('express').Router();
const controllers = require('../controllers');
const auth = require('../utils/auth');

router.get('/', auth(false), controllers.home.get.home);

module.exports = router;
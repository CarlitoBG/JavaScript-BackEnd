
const router = require('express').Router();
const controllers = require('../controllers');

router.get('/', controllers.home.get.home);

router.get('/home', controllers.home.get.home);

module.exports = router;
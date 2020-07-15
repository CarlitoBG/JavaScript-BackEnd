const router = require('express').Router();
const controllers = require('../controllers');
const  auth  = require('../utils/auth'); 

router.get('/', auth(false), controllers.home.get.home);

router.get('/home', auth(false), controllers.home.get.home);

module.exports = router;
const router = require('express').Router();
const controllers = require('../controllers');
const auth = require('../utils/auth');
const expenseValidator = require('../utils/expenseValidator');

router.get('/create', auth(), controllers.expense.get.create);

router.post('/create', auth(), expenseValidator, controllers.expense.post.create);

router.get('/report/:id', auth(), controllers.expense.get.report);

router.get('/delete/:id', auth(), controllers.expense.get.delete);

module.exports = router;
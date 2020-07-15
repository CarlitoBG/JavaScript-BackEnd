const { body } = require('express-validator');

module.exports = [
    body('username')
        .custom((value) => {
            if (value === '') {
                throw new Error('Username is required!');
            }
            return true;
        }),
    body('username', 'Username should be at least 4 symbols long!')
        .isLength({ min: 4 }),
    body('username', 'Username should contain only letters and digits!')
        .isAlphanumeric(),
    body('password')
        .custom((value) => {
            if (value === '') {
                throw new Error('Password is required!');
            }
            return true;
        }),
    body('password', 'Password should be at least 8 symbols long!')
        .isLength({ min: 8 }),
    body('password', 'Password should contain only letters and digits!')
        .isAlphanumeric(),
    body('amount')
        .custom((value) => {
            if (+value < 0) {
                throw new Error('Account amount should be positive number!');
            }
            return true;
        })
]
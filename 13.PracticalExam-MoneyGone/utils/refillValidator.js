const { body } = require('express-validator');

module.exports = [
    body('refill')
        .custom((value) => {
            if (value === '') {
                throw new Error('Refill could not be empty!');
            }
            return true;
    }),
    body('refill')
        .custom((value) => {
            if (isNaN(value)) {
                throw new Error('Refill should be a number!');
            }
            return true;
        }),
    body('refill')
        .custom((value) => {
            if (value <= 0) {
                throw new Error('Refill should be a positive number!');
            }
            return true;
        })
]
const { body } = require('express-validator');

module.exports = [
    body('merchant')
        .custom((value) => {
            if (value === '') {
                throw new Error('Merchant is required!');
            }
            return true;
    }),
    body('merchant', 'Merchant should be at least 4 symbols long!')
        .isLength({ min: 4 }),
    body('total')
        .custom((value) => {
            if (value === '') {
                throw new Error('Total is required!');
            }
            return true;
    }),
    body('total')
        .custom((value) => {
            if (isNaN(value)) {
                throw new Error('Total should be a number!');
            }
            return true;
        }),
    body('total')
        .custom((value) => {
            if (value <= 0) {
                throw new Error('Total should be a positive number!');
            }
            return true;
        }),
    body('category')
        .custom((value) => {
            if (value === undefined) {
                throw new Error('You should select one of the given categories!');
            }
            return true;
        }),
    body('description')
        .custom((value) => {
            if (value === '') {
                throw new Error('Description is required!');
            }
            return true;
    }),
    body('description', 'Description should be at least 10 symbols long!')
        .isLength({ min: 10 }),
    body('description', 'Description could not be more than 50 symbols long!')
        .isLength({ max: 50 }),
]
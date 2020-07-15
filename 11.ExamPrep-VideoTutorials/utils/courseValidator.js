const { body } = require('express-validator');

module.exports = [
    body('title', 'Title should be at least 5 symbols long!')
        .isLength({ min: 5 }),
    body('description', 'Description should be at least 20 symbols long!')
        .isLength({ min: 20 }),
    body('imageUrl')
        .custom((value) => {
            if (!value.startsWith('http') || !value.startsWith('https')) {
                throw new Error('Image url should start with http or https!');
            }
            return true;
        })
]
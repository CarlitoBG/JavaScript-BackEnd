const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = mongoose.model;

const articleSchema = new Schema({

    title: {
        type: mongoose.SchemaTypes.String,
        required: [true, 'Article title is required!'],
        unique: [true, 'Article should be unique!'],
        minlength: [5, 'Article title should be at least 5 symbols long!']
    },

    description: {
        type: mongoose.SchemaTypes.String,
        required: [true, 'Description is required!'],
        minlength: [20, 'Description should be at least 20 symbols long!']
    },

    articleAuthor: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },

    creationDate: {
        type: mongoose.SchemaTypes.Date,
        default: Date.now
    },

});

module.exports = new Model('Article', articleSchema);
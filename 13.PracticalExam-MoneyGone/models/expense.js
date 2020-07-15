const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = mongoose.model;

const expenseSchema = new Schema({

    merchant: {
        type: mongoose.SchemaTypes.String,
        required: true
    },

    total: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },

    category: {
        type: mongoose.SchemaTypes.String,
        required: true
    },

    description: {
        type: mongoose.SchemaTypes.String,
        required: true
    },

    report: {
        type: mongoose.SchemaTypes.Boolean,
        default: false
    },

    date: {
        type: mongoose.SchemaTypes.Date,
        required: true,
        default: Date.now
    },

    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    }
});

module.exports = new Model('Expense', expenseSchema);
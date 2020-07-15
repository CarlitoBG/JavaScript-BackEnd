const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Schema = mongoose.Schema;
const Model = mongoose.model;

const userSchema = new Schema({

    username: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    },

    password: {
        type: mongoose.SchemaTypes.String,
        required: true
    },

    amount: {
        type: mongoose.SchemaTypes.Number,
        default: 0
    },

    expenses: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Expense'
    }]
});

userSchema.methods = {
    matchPassword: function (password) {
        return bcrypt.compare(password, this.password);
    }
};

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) { next(err); return; }
            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err) { next(err); return; }
                this.password = hash;
                next();
            });
        });
        return;
    }
    next();
});

module.exports = new Model('User', userSchema);
const mongoose = require('mongoose');

const cubeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: [
      {
        validator: function (v) {
          return v.length >= 5;
        },
        message: props => `${props.value} is not a valid name! Cube name length should be larger than 5!`
      },
      {
        validator: function (v) {
          return v.length <= 10;
        },
        message: props => `${props.value} is not a valid name! Cube name length should be less then 10!`
      },
    ]
  },
  description: String,
  imageUrl: String,
  difficultyLevel: Number,
  accessories: [{ type: mongoose.Types.ObjectId, ref: 'Accessories' }],
  creatorId: { type: mongoose.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Cube', cubeSchema);
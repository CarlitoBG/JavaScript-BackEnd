const mongoose = require('mongoose');

const accessoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: [
      {
        validator: function (v) {
          return v.length >= 5;
        },
        message: props => `${props.value} length should be larger than 5!`
      },
      {
        validator: function (v) {
          return v.length <= 10;
        },
        message: props => `${props.value} length should be less then 10!`
      },
    ]
  },
  description: String,
  imageUrl: String,
  cubes: [{ type: mongoose.Types.ObjectId, ref: 'Cube' }]
});

module.exports = mongoose.model('Accessories', accessoriesSchema);
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  directions: [String],
  // ingredients: [ingredientsSchema]
});

const ingredientsSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  measurement: {
    type: String,
    enum: ['teaspoon', 'tablespoon', 'cup', 'ounce', 'grams'],
    required: true,
  },
  name: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Recipe', schema);

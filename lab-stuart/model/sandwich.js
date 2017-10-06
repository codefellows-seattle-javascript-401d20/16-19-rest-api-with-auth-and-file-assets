'use strict';

const mongoose = require('mongoose');

const sandwichSchema = mongoose.Schema({
  account: {type: mongoose.Schema.Types.ObjectId, required: true, unique: true},
  title: {type: String, required: true, unique: true},
  bread: {type: String, required: true},
  cheese: {type: String},
  spread: [{type: String}],
  veggies: [{type: String}],
});

module.exports = mongoose.model('sandwiche', sandwichSchema);

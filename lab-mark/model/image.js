'use strict';

const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
  title: {type: String, required: true},
  description : {type: String},
  url: {type: String, required: true},
  created: {type: Date, default: () => new Date},
  account: {type: mongoose.Schema.Types.ObjectId, required: true},
});

module.exports = mongoose.model('image', imageSchema);

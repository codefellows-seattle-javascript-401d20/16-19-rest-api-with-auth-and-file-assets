'use strict';

const mongoose = require('mongoose');

const characterSchema = mongoose.Schema({
  characterName: {type: String, required: true},
  characterImage: {type: String, required: true},
  created: {type: Date, default: () => new Date},
})

module.exports = mongoose.model('sample', sampleSchema);

'use strict';

const mongoose = require('mongoose');

const characterSchema = mongoose.Schema({
  characterName: {type: String, required: true, unique: true},
  image: {type: Buffer, required: true, unique: true},
  account: {type: mongoose.Schema.Types.ObjectId, required: true},
  created: {type: Date, default: () => new Date},
});

module.exports =mongoose.model('character', characterSchema);

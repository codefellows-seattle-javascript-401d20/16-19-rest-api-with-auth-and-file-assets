'use strict';

const mongoose = require('mongoose');

const characterSchema = mongoose.Schema({

  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  bio: {type: String},
  avatar: {type: String},
  birthday: {type: Date},
  location: {type: String},
  account: {type: mongoose.Schema.Types.ObjectId, required: true, unique: true},

});

module.exports = mongoose.model('character', characterSchema);

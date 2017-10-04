'use strict';

const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  firstName: {type: String},
  lastName: {type: String},
  favoriteBook: {type: String},
  favoriteMovie: {type: String},
  favoriteHobby: {type: String},
  favoriteQuote: {type: String},
  avatar: {type: String},
  location: {type: String},
  account: {type: mongoose.Schema.Types.ObjectId, required: true, unique: true},
});

module.exports = mongoose.model('profile', profileSchema);

'use strict';

const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  avatar: {type: String},
  location: {type: String},
  firstName: {type: String},
  lastName: {type: String},
  bio: {type: String},
  birthday: {type: String},
  account: {type: mongoose.Schema.Types.ObjectId, required: true, unique: true},
});

module.exports = mongoose.model('profile', profileSchema);

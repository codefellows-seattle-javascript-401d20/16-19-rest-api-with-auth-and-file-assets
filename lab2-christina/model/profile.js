'use strict';

const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  email: {type:String, required: true, unique: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  bio: {type: String},
  avatar: {type: String},
  birthday: {type: Date},
  location: {type: String},
  account: { type: mongoose.Schema.Types.ObjectId, required: true },
});

module.exports = mongoose.model('profile', profileSchema);

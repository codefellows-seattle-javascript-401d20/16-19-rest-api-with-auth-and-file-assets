'use strict';

const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  account: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  location: { type: String },
  birthday: { type: Date },
  avatar: { type: String },
  bio: { type: String },
});

module.exports = mongoose.model('profile', profileSchema);
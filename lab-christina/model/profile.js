'use strict';

const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
  userName: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  account: {type: mongoose.Schema.Types.ObjectId, required: true, unique: true},
  firstName: {type: String},
  lastName: {type: String},
});

module.exports = mongoose.model('profile', profileSchema);

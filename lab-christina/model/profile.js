'use strict';

const mongoose = require('mongoose');

const profleSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  email: {type:String, required: true, unique: true},
  bio: {type: String},
  avatar: {type: String},
  birthday: {type: Date},
  location: {type: String},
  firstName: {tpye: String},
  lastName: {type: String},
});

module.exports = mongoose.model('profile', profileSchema);

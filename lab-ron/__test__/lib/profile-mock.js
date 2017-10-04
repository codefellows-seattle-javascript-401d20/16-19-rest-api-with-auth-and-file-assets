'use strict';

const faker = require('faker');
const accountMock = require('./account-mock.js');
const Profile = require('../../model/profile.js');

let create = () => {
  let result = {};
  return accountMock.create()
    .then(tempAccount => {
      result.tempAccount = tempAccount;
      return new Profile({
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        account: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
        firstName: { type: String },
        lastName: { type: String },
        location: { type: String },
        birthday: { type: Date },
        avatar: { type: String },
        bio: { type: String },
      }).save();
    })

    
    .then();
};
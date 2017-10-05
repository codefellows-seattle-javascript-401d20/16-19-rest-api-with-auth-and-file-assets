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
        userName: tempAccount.request.userName,
        email: tempAccount.request.email,
        account: tempAccount.account._id,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      }).save();
    })
    .then(profile => {
      result.profile = profile;
      return result;
    });
};

let remove = () => {
  return Promise.all([
    accountMock.remove(),
    Profile.remove({}),
  ]);
};

module.exports = {create, remove};

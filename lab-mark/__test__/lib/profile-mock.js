'use strict';

const accountMock = require('./account-mock.js');
const Profile = require('../../model/profile.js');
const faker = require('faker');

// Resolves -> request, account, token, profile
let create = () => {
  let result = {};
  return accountMock.create(faker.internet.password())
    .then(tempAccount => {
      result = tempAccount;
      return new Profile({
        username: tempAccount.request.username,
        email: tempAccount.request.email,
        account: tempAccount.account._id,
        bio: faker.lorem.words(50),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        avatar: faker.random.image(),
        location: faker.address.city(),
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

'use strict';

const faker = require('faker');
const accountMock = require('./account-mock.js');
const Profile = require('../../model/profile.js');

const profileMock = module.exports = {};

profileMock.create = () => {
  let result = {};
  return accountMock.create()
    .then(tempAccount => {
      result.tempAccount = tempAccount;
      return new Profile({
        username: tempAccount.request.username,
        email: tempAccount.request.email,
        account: tempAccount.account._id,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        avatar: faker.random.image(),
        intro: faker.lorem.words(300),
    }).save();
  })
  .then(profile => {
    result.profile = profile;
    return result;
  });
};

profileMock.remove = () => {
  return Promise.all([
    accountMock.remove,
    Profile.remove({}),
  ]);
}

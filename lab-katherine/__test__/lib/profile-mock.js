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
        username: tempAccount.request.username,
        email: tempAccount.request.email,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        favoriteBook: faker.lorem.words(2),
        favoriteMovie: faker.lorem.words(2),
        favoriteHobby: faker.lorem.words(2),
        favoriteQuote: faker.lorem.words(5),
        avatar: faker.random.image(),
        location: faker.address.city(),
        account: tempAccount.account._id,
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

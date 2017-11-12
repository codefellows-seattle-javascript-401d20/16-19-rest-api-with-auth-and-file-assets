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
        account: tempAccount.account._id,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        location: faker.address.city(),
        avatar: faker.random.image(),
        bio: faker.lorem.words(100),
      }).save();
    })
    .then(profile => {
      result.profile = profile;
      return result;
    });
};


let createMany = (num) => {
  return Promise.all(new Array(num).fill(0).map(() => create()));
};

let remove = () => {
  return Promise.all([
    accountMock.remove(),
    Profile.remove({}),
  ]);
};

module.exports = { create, createMany, remove };
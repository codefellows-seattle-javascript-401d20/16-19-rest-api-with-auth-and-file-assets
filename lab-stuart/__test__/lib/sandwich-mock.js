'use strict';

const faker = require('faker');
const accountMock = require('./account-mock.js');
const Sandwich = require('../../model/sandwich.js');

let create = () => {
  let result = {};
  return accountMock.create()
  .then(tempAccount => {
    result.tempAccount = tempAccount;
    return new Sandwich({
      account: tempAccount.account._id, 
      title: faker.lorem.words(4),
      bread: faker.lorem.words(4),
      cheese: faker.lorem.words(4),
      spread: faker.lorem.words(4).split(' '),
      veggies: faker.lorem.words(4).split(' '),
    }).save();
  })
  .then(sandwich => {
    result.sandwich = sandwich;
    return result;
  });
}

let remove = () => {
  return Promise.all([
    accountMock.remove(),
    Sandwich.remove({}),
  ]);
}

module.exports = {create, remove}

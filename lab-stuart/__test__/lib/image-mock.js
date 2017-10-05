'use strict';

const faker = require('faker');
const accountMock = require('./account-mock.js');
const Image = require('../../model/image.js');

const create = () => {
  let result = {};
  return accountMock.create()
  .then(account => {
    result.tempAccount = account;
    return new Image({
      account: account._id,
      title: faker.lorem.words(10),
      url: faker.image.image(),
    }).save();
  })
  .then(image => {
    result.image = image;
    return result;
  });
}

const remove = () => {
  return Promise.all([
    accountMock.remove,
    Image.remove({}),
  ]);
}

module.exports = {create, remove}

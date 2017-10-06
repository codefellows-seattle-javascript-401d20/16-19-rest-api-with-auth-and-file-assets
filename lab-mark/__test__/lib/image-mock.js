'use strict';

const faker = require('faker');
const accountMock = require('./account-mock.js');
const Image = require('../../model/image.js');

// Resolves -> request, account, token,  image
const create = () => {
  let result = {};
  return accountMock.create(faker.internet.password())
    .then(data => {
      result = data;
      return new Image({
        account: data.account._id,
        title: faker.lorem.words(5),
        description: faker.lorem.words(10),
        url:'dog.jpg',
      }).save();
    })
    .then(image => {
      result.image = image;
      return result;
    });
};

const remove = () => {
  return Promise.all([
    accountMock.remove,
    Image.remove({}),
  ]);
};

module.exports = { create, remove };

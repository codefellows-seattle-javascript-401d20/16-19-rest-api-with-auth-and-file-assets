'use strict';

const faker = require('faker');
const accountMock = require('./account-mock.js');
const Image = require('../../model/image.js');

const create = () => {
  let result = {};
  return accountMock.create()
    .then(accountMock => {
      result.tempAccount = accountMock;
      return new Image({
        account: accountMock.account._id,
        title: faker.lorem.words(5),
        url: faker.image.image(),
      });
    })
    .then();
};
const remove = () => { };

module.exports = { create, remove };

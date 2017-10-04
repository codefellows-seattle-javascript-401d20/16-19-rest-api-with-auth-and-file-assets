'use strict';

const faker = require('faker');
const Account = require('../../model/account.js');

const create = () => {
  let result = {
    request: {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.lorem.words(),
    },
  };

  return Account.create(result.request)
    .then(account => {
      result.account = account;
      return account.tokenCreate();
    })
    .then(token => {
      result.token = token;
      return Account.findById(result.account._id);
    })
    .then(account => {
      result.account = account;
      return result;
    });
};

const remove = () => Account.remove({});

module.exports = { create, remove };
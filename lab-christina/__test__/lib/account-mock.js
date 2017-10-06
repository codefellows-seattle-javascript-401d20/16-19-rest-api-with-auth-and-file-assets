'use strict';

const Account = require('../../model/account.js');
const faker = require('faker');

const create = () => {
  let result = {
    request: {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.lorem.words(10),
    },
  };

return Account.create(result.request)
    .then(account => {
      result.account = account;//cache the account on result
      return account.tokenCreate(); //generate the token
    })

    .then(token => {
      result.token = token;//cache the token
      return Account.findById(result.account._id);//rrequest the updated account
    })
    .then(account => {
      result.account = account; //overwrite the cached account with the updated account
      return result;
    });
};

const remove = () => Account.remove({});

module.exports = {create, remove};

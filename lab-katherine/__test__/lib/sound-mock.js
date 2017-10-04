'use strict';

const faker = require('faker');
const accountMock = require('./account-mock.js');
const Sound = require('../../model/sound.js');

const create = () => {
  let result = {};
  return accountMock.create()
    .then( account => {
      result.tempAccount = account;
      return new Sound({
        account: account._id,
        title: faker.lorem.words(10),
        url: faker.sound.sound(),
      }).save();
    })
    .then(sound => {
      result.sound = sound;
      return result;
    });
};

const remove = () => {
  return Promise.all([
    accountMock.remove,
    Sound.remove({}),
  ]);
};

module.exports = { create, remove };

'use strict';

const faker = require('faker');
const accountMock = require('./account-mock.js');
const Sound = require('../../model/sound.js');

const create = () => {
  let result = {};
  return accountMock.create()
    .then( accountMock => {
      result.tempAccount = accountMock;
      return new Sound({
        account: accountMock.account._id,
        title: faker.lorem.words(10),
        url: faker.image.image(),
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

'use strict';

require('./lib/setup.js');

const superagent = require('superagent');
const server = require('../lib/server.js');
const accountMock = require('./lib/account-mock.js');
const profileMock = require('./lib/profile-mock.js');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('/profiles', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(profileMock.remove);

  describe('POST /profiles', () => {
    test('200 should return a profile', () => {
      let tempAccount
      return accountMock.create()
      .then(mock => {
        tempAccount = mock;
        return superagent.post(`${apiURL}/profiles`)
        .set('Authorization', `Bearer ${tempAccount.token}`)
        .send({
          firstName: 'John',
          lastName: 'Jacobs',
          intro: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet.',
        })
      })
      .then(response => {
        expect(response.status).toEqual(200);
        expect(response.body.username).toEqual(tempAccount.request.username);
        expect(response.body.email).toEqual(tempAccount.request.email);
        expect(response.body.firstName).toEqual('John');
        expect(response.body.lastName).toEqual('Jacobs');
        expect(response.body.intro).toEqual('Neque porro quisquam est qui dolorem ipsum quia dolor sit amet.');
      });
    });
  });
});

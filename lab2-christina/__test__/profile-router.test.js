'use strict';

require('../__test__/lib/setup.js');
const superagent = require('superagent');
const server = require('../lib/server.js');
const accountMock = require('../__test__/lib/account-mock.js');
const profileMock = require('../__test__/lib/profile-mock.js');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('/profiles', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(profileMock.remove);

  describe('POST /profiles', () => {
    test('200 Profile returned', () => {
      let tempAccount;
      return accountMock.create()
        .then(mock => {
          tempAccount = mock;
          return superagent.post(`${apiURL}/profiles`)
            .set('Authorization', `Bearer ${tempAccount.token}`)
            .send({
              firstName: 'John',
              lastName: 'Jacobs',
            });
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.username).toEqual(tempAccount.request.username);
          expect(response.body.email).toEqual(tempAccount.request.email);
          expect(response.body.firstName).toEqual('John');
          expect(response.body.lastName).toEqual('Jacobs');
        });
    });

    test('400 should return __BAD REQUEST__', () => {
      let tempAccount;
      return accountMock.create()
        .then(mock => {
          tempAccount = mock;
          return superagent.post(`${apiURL}/profiles`)
            .set('Authorization', `Bearer ${tempAccount.token}`)
            .send({
              firstName: 'Jane',
            });
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('401 should return nothing', () => {
      return superagent.post(`${apiURL}/profiles`)
        .set('Authorization', 'funky token')
        .send({
          firstName: 'John',
          lastName: 'Jacobs',
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(401);
        });
    });
  });
});

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
      let tempAccount;
      return accountMock.create()
        .then(mock => {
          tempAccount = mock;
          return superagent.post(`${apiURL}/profiles`)
            .set('Authorization', `Bearer ${tempAccount.token}`)
            .send({
              firstName: 'Katherine',
              lastName: 'Hanson',
              favoriteQuote: 'Something something something something something something something something something something',
            });
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.username).toEqual(tempAccount.request.username);
          expect(res.body.email).toEqual(tempAccount.request.email);
          expect(res.body.account).toEqual(tempAccount.account._id.toString());
          expect(res.body.firstName).toEqual('Katherine');
          expect(res.body.lastName).toEqual('Hanson');
          expect(res.body.favoriteQuote).toEqual('Something something something something something something something something something something');
        });
    });

    test('400 should not return a profile', () => {
      return superagent.post(`${apiURL}/profiles`)
        .send('fsjfbsnjhfb')
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });

    test('401 should not return a profile', () => {
      return superagent.post(`${apiURL}/profiles`)
        .set('Authorization', `Bearer bad token`)
        .send({
          firstName: 'Katherine',
          lastName: 'Hanson',
          favoriteQuote: 'Something something something something something something something something something something',
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });
  });

  describe('GET /profiles/:id', () => {
    test('GET /login 200', () => {
      accountMock.create()
        .then(mock => {
          return superagent.get(`${apiURL}/login/mock.request._id`)
            .auth(mock.request.username, mock.request.password);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.token).toBeTruthy();
        });
    });

    test('GET /login 404', () => {
      accountMock.create()
        .then(mock => {
          return superagent.get(`${apiURL}/login/gskjgnsjgn`)
            .auth(mock.request.username, mock.request.password);
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });
});

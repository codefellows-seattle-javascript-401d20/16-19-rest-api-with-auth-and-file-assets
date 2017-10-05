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
    test('GET /profiles/:id 200', () => {
      let tempMock;
      return profileMock.create()
        .then(mock => {
          tempMock = mock;
          return superagent.get(`${apiURL}/profiles/${mock.profile._id}`)
            .set('Authorization', `Bearer ${mock.tempAccount.token}`)
            .then(res => {
              expect(res.status).toEqual(200);
              expect(res.body.firstName).toEqual(tempMock.profile.firstName);
              expect(res.body.lastName).toEqual(tempMock.profile.lastName);
              expect(res.body.favoriteBook).toEqual(tempMock.profile.favoriteBook);
              expect(res.body.favoriteMovie).toEqual(tempMock.profile.favoriteMovie);
              expect(res.body.favoriteHobby).toEqual(tempMock.profile.favoriteHobby);
              expect(res.body.favoriteQuote).toEqual(tempMock.profile.favoriteQuote);
              expect(res.body.avatar).toEqual(tempMock.profile.avatar);
              expect(res.body.location).toEqual(tempMock.profile.location);
              expect(res.body._id).toEqual(tempMock.profile._id.toString());
              expect(res.body.account).toEqual(tempMock.tempAccount.account._id.toString());
              expect(res.body.username).toEqual(tempMock.tempAccount.account.username);
              expect(res.body.email).toEqual(tempMock.tempAccount.account.email);
            });
        });
    });

    test('GET /profiles 404', () => {
      return profileMock.create()
        .then(mock => {
          return superagent.get(`${apiURL}/profiles/nope`)
            .set('Authorization', `Bearer ${mock.tempAccount.token}`)
            .then(Promise.reject)
            .catch(res => {
              expect(res.status).toEqual(404);
            });
        });
    });

    test('GET /profiles 401', () => {
      return profileMock.create()
        .then(mock => {
          return superagent.get(`${apiURL}/profiles/${mock.profile._id}`)
            .set('Authorization', `Bearer ${mock.tempAccount}`)
            .then(Promise.reject)
            .catch(res => {
              expect(res.status).toEqual(401);
            });
        });
    });
  });
});

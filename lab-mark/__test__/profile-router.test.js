'use strict';

require('./lib/setup.js');

const superagent = require('superagent');
const server = require('../lib/server.js');
const accountMock = require('./lib/account-mock.js');
const profileMock = require('./lib/profile-mock.js');
const faker = require('faker');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('/profiles', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(profileMock.remove);

  describe('POST /profiles', () => {
    test('200 should return a profile', () => {
      let tempAccount;
      return accountMock.create(faker.internet.password())
        .then(mock => {
          tempAccount = mock;
          return superagent.post(`${apiURL}/profiles`)
            .set('Authorization', `Bearer ${tempAccount.token}`)
            .send({
              bio: 'hello world',
              firstName: 'Darcy',
              lastName: 'Balaka',
            });
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.username).toEqual(tempAccount.request.username);
          expect(res.body.email).toEqual(tempAccount.request.email);
          expect(res.body.account).toEqual(tempAccount.account._id.toString());
          expect(res.body.bio).toEqual('hello world');
          expect(res.body.firstName).toEqual('Darcy');
          expect(res.body.lastName).toEqual('Balaka');
        });
    });

    test('400 should return authorization header required', () => {
      let tempAccount;
      return accountMock.create(faker.internet.password())
        .then(mock => {
          tempAccount = mock;
          return superagent.post(`${apiURL}/profiles`)
            .set('Othorization', `Bearer ${tempAccount.token}`) // Mispelled authorization
            .send({
              bio: 'hello world',
              firstName: 'Mary',
              lastName: 'Bean',
            });
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });

    test('401 should return Bearer auth required', () => {
      let tempAccount;
      return accountMock.create(faker.internet.password())
        .then(mock => {
          tempAccount = mock;
          return superagent.post(`${apiURL}/profiles`)
            .set('Authorization', `Basic ${tempAccount.token}`) // Basic instead of Bearer
            .send({
              bio: 'hello world',
              firstName: 'Mary',
              lastName: 'Bean',
            });
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });

    test('401 should return Bearer auth required', () => {
      return accountMock.create(faker.internet.password())
        .then(() => {
          return superagent.post(`${apiURL}/profiles`)
            .set('Authorization', `Bearer shayayayayaya`) // Bogus token
            .send({
              bio: 'hello world',
              firstName: 'Mary',
              lastName: 'Bean',
            });
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });
  });

  describe('GET /profiles/:id', () => {
    test('200 should return a profile', () => {
      let tempMock;
      return profileMock.create(faker.internet.password())
        .then(mock => {
          tempMock = mock;
          return superagent.get(`${apiURL}/profiles/${mock.profile._id}`)
            .set('Authorization', `Bearer ${tempMock.token}`);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.username).toEqual(tempMock.profile.username);
          expect(res.body.email).toEqual(tempMock.profile.email);
          expect(res.body.account).toEqual(tempMock.profile.account.toString());
          expect(res.body.bio).toEqual(tempMock.profile.bio);
          expect(res.body.firstName).toEqual(tempMock.profile.firstName);
          expect(res.body.lastName).toEqual(tempMock.profile.lastName);
          expect(res.body.location).toEqual(tempMock.profile.location);
          expect(res.body.avatar).toEqual(tempMock.profile.avatar);
        });
    });

    test('404 should return profile does not exist', () => {
      let tempMock;
      return profileMock.create(faker.internet.password())
        .then(mock => {
          tempMock = mock;
          return superagent.get(`${apiURL}/profiles/shanananana`) // Bogus ID
            .set('Authorization', `Bearer ${tempMock.token}`);
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });

    test('400 should return authorization header required', () => {
      let tempMock;
      return profileMock.create(faker.internet.password())
        .then(mock => {
          tempMock = mock;
          return superagent.get(`${apiURL}/profiles/${mock.profile._id}`)
            .set('Othorization', `Bearer ${tempMock.token}`); // Mispelled authorization
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });

    test('401 should return Bearer auth required', () => {
      let tempMock;
      return profileMock.create(faker.internet.password())
        .then(mock => {
          tempMock = mock;
          return superagent.get(`${apiURL}/profiles/${mock.profile._id}`)
            .set('Authorization', `Basic ${tempMock.token}`); // Basic instead of Bearer
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });

    test('401 should return Bearer auth required', () => {
      return profileMock.create(faker.internet.password())
        .then(mock => {
          return superagent.get(`${apiURL}/profiles/${mock.profile._id}`)
            .set('Authorization', `Bearer shayayayayaya`); // Bogus token
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });
  });
});

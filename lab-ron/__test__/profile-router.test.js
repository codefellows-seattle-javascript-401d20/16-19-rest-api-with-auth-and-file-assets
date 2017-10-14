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
              firstName: 'George',
              lastName: 'Castanza',
              location: 'New York',
              bio: 'I was in a show about nothing',
            });
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.username).toEqual(tempAccount.request.username);
          expect(res.body.email).toEqual(tempAccount.request.email);
          expect(res.body.account).toEqual(tempAccount.account._id.toString());
          expect(res.body.bio).toEqual('I was in a show about nothing');
          expect(res.body.firstName).toEqual('George');
          expect(res.body.lastName).toEqual('Castanza');
        });
    });

    test('401 returning nothing', () => {
      return superagent.post(`${apiURL}/profiles`)
        .set('Authorization', `Bearer wtftoken`)
        .send({
          firstName: 'Harold',
          lastName: 'Petersonburgton',
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });
  });

  describe('GET /profiles', () => {
    test('200 get profile', () => {
      return profileMock.createMany(20)
        .then(() => {
          return superagent.get(`${apiURL}/profiles`);
        })
        .then(res => {
          // console.log(res.body);
          expect(res.status).toEqual(200);
          expect(res.body.count).toEqual(20);
        });
    });

    test('200 page should be NaN', () => {
      return profileMock.create()
        .then(() => {
          return superagent.get(`${apiURL}/profiles?page=wedrfgh`);
        })
        .then(res => {
          expect(res.status).toEqual(200);
        });
    });

    test('200 page should be less than zero', () => {
      return profileMock.create()
        .then(() => {
          return superagent.get(`${apiURL}/profiles?page=-1`);
        })
        .then(res => {
          expect(res.status).toEqual(200);
        });
    });

    test('200 page should be less than zero', () => {

      return profileMock.create()
        .then(() => {
          return superagent.get(`${apiURL}/profiles?page=1`);

        })
        .then(res => {
          expect(res.status).toEqual(200);
        });

    });

    test('GET /profiles? 200 fuzzies', () => {
      return accountMock.create()
        .then(() => {
          return profileMock.createMany(100)
            .then(() => {
              return superagent.get(`${apiURL}/profiles?firstName=a&lastName=a`);
            })
            .then(res => {
              expect(res.status).toEqual(200);
            });
        });
    });

    test('GET /profiles/:id 200', () => {
      let tempMock;
      return profileMock.create()
        .then(mock => {
          tempMock = mock;
          return superagent.get(`${apiURL}/profiles/${mock.profile._id}`);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.lastName).toEqual(tempMock.profile.lastName);
          expect(res.body._id).toEqual(tempMock.profile._id.toString());
          expect(res.body.firstName).toEqual(tempMock.profile.firstName);
          expect(res.body.account).toEqual(tempMock.tempAccount.account._id.toString());
        });
    });

    test('GET /profiles/:id 404', () => {
      return profileMock.create()
        .then(() => {
          return superagent.get(`${apiURL}/profiles/badjoojoo`);
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });
});



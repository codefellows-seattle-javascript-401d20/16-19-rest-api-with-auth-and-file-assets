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
    test.only('200 get profile', () => {
      return profileMock.createMany(20)
        .then(() => {
          return superagent.get(`${apiURL}/profiles`);
        })
        .then(res => {
          console.log(res.body);
          expect(res.status).toEqual(200);
        });
    });

    // test('200 get profile', () => {
    //   let tempAccount;
    //   return accountMock.create()
    //     .then(mock => {
    //       tempAccount = mock;
    //       console.log(tempAccount.token);
    //       return superagent.get(`${apiURL}/profiles`)
    //         .set('Authorization', `Bearer ${tempAccount.token}`);
    //     })
    //     .then(res => {
    //       expect(res.status).toEqual(200);
    //     });
    // });
  });
});




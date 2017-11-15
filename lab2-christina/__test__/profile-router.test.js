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


    describe('GET /profiles/:id', () => {

      test('GET /profiles/:id 200', () => {
        let tempAccount;
        return profileMock.create()
          .then(mock => {
            tempAccount = mock;
            return superagent.get(`${apiURL}/profiles/${mock.profile._id}`)
              .set('Authorization', `Bearer ${mock.tempAccount.token}`)
              .then(response => {
                expect(response.status).toEqual(200);
                expect(response.body.username).toEqual(tempAccount.tempAccount.account.username);
                expect(response.body.email).toEqual(tempAccount.tempAccount.account.email);
                expect(response.body.account).toEqual(tempAccount.tempAccount.account._id.toString());
                expect(response.body.firstName).toEqual(tempAccount.profile.firstName);
                expect(response.body.lastName).toEqual(tempAccount.profile.lastName);
                expect(response.body.avatar).toEqual(tempAccount.profile.avatar);
                expect(response.body.intro).toEqual(tempAccount.profile.intro);
              });
          });
      });

      test('GET /profiles 401', () => {
        return profileMock.create()
          .then(mock => {
            return superagent.get(`${apiURL}/profiles/${mock.profile._id}`)
              .set('Authorization', `Bearer ${mock.tempAccount}`)
              .then(Promise.reject)
              .catch(response => {
                expect(response.status).toEqual(401);
              });
          });
      });

      test('GET /profiles 404', () => {
        return profileMock.create()
          .then(mock => {
            return superagent.get(`${apiURL}/profiles/rejection`)
              .set('Authorization', `Bearer ${mock.tempAccount.token}`)
              .then(Promise.reject)
              .catch(response => {
                expect(response.status).toEqual(404);
              });
          });
      });
    });
  });
});

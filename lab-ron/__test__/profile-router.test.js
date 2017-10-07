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
          //   console.log(`

          //  STATUS: ${res.status}
          //  USERNAME: ${res.body.username}
          //  BODY: ${res.body.email}
          //  ACCOUNT: ${res.body.account}
          //  BIO: ${res.body.bio}
          //  FIRSTNAME: ${res.body.firstName}
          //  LASTNAME: ${res.body.lastName}

          //   `);

          expect(res.status).toEqual(200);
          // expect(res.body.username).toEqual(tempAccount.request.username);
          // expect(res.body.email).toEqual(tempAccount.request.email);
          // expect(res.body.account).toEqual(tempAccount.account._id.toString());
          // expect(res.body.bio).toEqual('I was in a show about nothing');
          // expect(res.body.firstName).toEqual('George');
          // expect(res.body.lastName).toEqual('Castanza');
        });
    });





  });


});




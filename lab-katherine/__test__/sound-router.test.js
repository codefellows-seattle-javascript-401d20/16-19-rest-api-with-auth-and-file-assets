'use strict';

require('./lib/setup.js');
const superagent = require('superagent');
const server = require('../lib/server.js');
const accountMock = require('./lib/account-mock.js');
const soundMock = require('./lib/sound-mock.js');

const apiURL = `http://localhost:${process.env.PORT}`;


describe('/sounds', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(soundMock.remove);

  describe('POST /sounds', () => {
    test('POST /sounds  200', () => {
      let tempAccountMock;
      return accountMock.create()
        .then(accountMock => {
          tempAccountMock = accountMock;
          return superagent.post(`${apiURL}/sounds`)
            .set('Authorization', `Bearer ${accountMock.token}`)
            .field('title', 'scary ambiance sound effects')
            .attach('sound', `${__dirname}/asset/scaryambiance.mp3`)
            .then(res => {
              expect(res.status).toEqual(200);
              expect(res.body.title).toEqual('scary ambiance sound effects');
              expect(res.body._id).toBeTruthy();
              expect(res.body.url).toBeTruthy();
              expect(res.body.account).toEqual(tempAccountMock.account._id.toString());
            });
        });
    });

    test('POST /sounds  400', () => {
      return accountMock.create()
        .then(accountMock => {
          return superagent.post(`${apiURL}/sounds`)
            .set('Authorization', `Bearer ${accountMock.token}`)
            .attach('sound', `${__dirname}/asset/scaryambiance.mp3`)
            .then(Promise.reject)
            .catch(res => {
              expect(res.status).toEqual(400);
            });
        });
    });

    test('POST /sounds  401', () => {
      return accountMock.create()
        .then(accountMock => {
          return superagent.post(`${apiURL}/sounds`)
            .set('Authorization', `Bearer ${accountMock}`)
            .field('title', 'scary ambiance sound effects')
            .attach('sound', `${__dirname}/asset/scaryambiance.mp3`)
            .then(Promise.reject)
            .catch(res => {
              expect(res.status).toEqual(401);
            });
        });
    });
  });

  describe('GET /sounds', () => {
    test('GET /sounds  200', () => {

    });
  });
});

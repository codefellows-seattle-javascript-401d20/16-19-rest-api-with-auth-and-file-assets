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

  describe('GET /sounds/:id', () => {
    test('GET /sounds/:id 200', () => {
      let tempMock;
      return soundMock.create()
        .then(mock => {
          tempMock = mock;
          return superagent.get(`${apiURL}/sounds/${mock.sound._id}`)
            .set('Authorization', `Bearer ${mock.tempAccount.token}`)
            .then(res => {
              expect(res.status).toEqual(200);
              expect(res.body.url).toEqual(tempMock.sound.url);
              expect(res.body.title).toEqual(tempMock.sound.title);
              expect(res.body._id).toEqual(tempMock.sound._id.toString());
              expect(res.body.account).toEqual(tempMock.tempAccount.account._id.toString());
            });
        });
    });

    test('GET /sounds/:id 401', () => {
      return soundMock.create()
        .then(mock => {
          return superagent.get(`${apiURL}/sounds/${mock.sound._id}`)
            .set('Authorization', `Bearer ${mock.tempAccount}`)
            .then(Promise.reject)
            .catch(res => {
              expect(res.status).toEqual(401);
            });
        });
    });

    test('GET /sounds/:id 404', () => {
      return soundMock.create()
        .then(mock => {
          return superagent.get(`${apiURL}/sounds/${mock.sound}`)
            .set('Authorization', `Bearer ${mock.tempAccount.token}`)
            .then(Promise.reject)
            .catch(res => {
              expect(res.status).toEqual(404);
            });
        });
    });
  });

  describe('DELETE /sounds/:id', () => {
    test('DELETE /sounds/:id 204', () => {
      return soundMock.create()
        .then(mock => {
          return superagent.delete(`${apiURL}/sounds/${mock.sound._id}`)
            .set('Authorization', `Bearer ${mock.tempAccount.token}`)
            .then(res => {
              expect(res.status).toEqual(204);
            });
        });
    });

    test('DELETE /sounds/:id 404', () => {
      return soundMock.create()
        .then(mock => {
          return superagent.delete(`${apiURL}/sounds/lol`)
            .set('Authorization', `Bearer ${mock.tempAccount.token}`)
            .then(Promise.reject)
            .catch(res => {
              expect(res.status).toEqual(404);
            });
        });
    });

    test('DELETE /sounds/:id 401', () => {
      return soundMock.create()
        .then(mock => {
          return superagent.delete(`${apiURL}/sounds/${mock.sound._id}`)
            .set('Authorization', `Bearer ${mock.tempAccount}`)
            .then(Promise.reject)
            .catch(res => {
              expect(res.status).toEqual(401);
            });
        });
    });
  });
});

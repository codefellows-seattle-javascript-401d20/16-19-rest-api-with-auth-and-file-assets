'use strict';

require('./lib/setup.js');
const superagent = require('superagent');
const server = require('../lib/server.js');
const accountMock = require('./lib/account-mock.js');

const apiURL = `http://localhost:${process.env.PORT}`;

console.log('apiURL', apiURL);

describe('AUTH router', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(accountMock.remove);

  describe('POST /signup', () => {
    test('POST /signup with 200', () => {
      let tempAccount = {
        username: 'username1234',
        email: 'username1234@gmail.com',
        password:'password1234',
      };
      return superagent.post(`${apiURL}/signup`)
        .send(tempAccount)
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.token).toBeTruthy();
        });
    });

    test('POST /signup with 400', () => {
      let tempAccount = {
        email: 'username1234@gmail.com',
        password: 'password1234',
      };
      return superagent.post(`${apiURL}/signup`)
        .send(tempAccount)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });
  });

  describe('GET /login', () => {
    test('GET /login 200', () => {
      return accountMock.create()
      .then(mock => {
        return superagent.get(`${apiURL}/login`)
        .auth(mock.request.username, mock.request.password);
      })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body.token).toBeTruthy();
      });
    });

    test('GET /login 400', () => {
      return accountMock.create()
        .then(mock => {
          return superagent.get(`${apiURL}/login`);
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });
  });
});

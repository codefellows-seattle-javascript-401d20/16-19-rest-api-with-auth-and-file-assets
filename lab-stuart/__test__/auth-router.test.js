'use strict';

require('./lib/setup.js');
const superagent = require('superagent');
const server = require('../lib/server.js');
const accountMock = require('./lib/account-mock.js');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('AUTH router', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(accountMock.remove);

  describe('POST /signup', () => {
    test('POST /signup with 200', () => {
      return superagent.post(`${apiURL}/signup`)
      .send({
        username: 'username1234',
        email: 'username1234@gmail.com',
        password: 'password1234',
      })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body.token).toBeTruthy();
      });
    });

    test('POST /signup with 400', () => {
      return superagent.post(`${apiURL}/signup`)
        .send({
          email: 'username1234@gmail.com',
          password: 'password1234',
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });
  });

  describe('GET /signup', () => {
    test('GET /login 401 due to bad password', () => {
      return accountMock.create()
      .then(mock => {
        return superagent.get(`${apiURL}/login`)
        .auth(mock.request.username, 'cheese');
      })
      .then(Promise.reject)
      .catch(res => {
        expect(res.status).toEqual(401);
      });
    });

    test('GET /login 401 due to bad account', () => {
      return superagent.get(`${apiURL}/login`)
      .auth('sandwichman','cheese')
      .then(Promise.reject)
      .catch(res => {
        expect(res.status).toEqual(401);
      });
    });
  });
});

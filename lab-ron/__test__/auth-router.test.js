'use strict';

require('./lib/setup.js');

const superagent = require('superagent');
const server = require('../lib/server.js');
const accountMock = require('./lib/account-mock.js');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('/profiles', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(accountMock.remove);

  describe('POST /signup', () => {

    test('POST /signup returning 200 OK', () => {
      return superagent.post(`${apiURL}/signup`)
        .send({
          username: 'hello',
          email: 'hello@world.com',
          password: 'helloworld',
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.token).toBeTruthy();
        });
    });
    test('POST /signup with 400', () => {
      return superagent.post(`${apiURL}/signup`)
        .send({
          email: 'hello@world.com',
          password: 'helloworld',
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });



  });

  describe('GET /login', () => {
    test('GET /login 200', () => {

      accountMock.create()
        .then(mock => {
          return superagent.get(`${apiURL}/login`)
            .auth(mock.request.username, mock.request.password);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.token).toBeTruthy();
        });
    });

    test('GET /login 401 bad password', () => {
      accountMock.create()
        .then(mock => {
          return superagent.get(`${apiURL}/login`)
            .auth(mock.request.username, 'fakePass');
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });

    test('GET /login 401 due to bad account', () => {
      return superagent.get(`${apiURL}/login`)
        .auth('not_a_real_user', 'fakePass')
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });
  });
});
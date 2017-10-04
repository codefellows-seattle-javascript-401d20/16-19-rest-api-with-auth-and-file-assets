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

  test('POST /signup with 200', () => {
    let goodAccount = {
      username: 'khanson',
      email: 'khanson@gmail.com',
      password:'himitsu',
    };
    return superagent.post(`${apiURL}/signup`)
      .send(goodAccount)
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body.token).toBeTruthy();
      });
  });

  test('POST /signup with 400', () => {
    let badAccount = {
      email: 'khanson@gmail.com',
      password: 'himitsu',
    };
    return superagent.post(`${apiURL}/signup`)
      .send(badAccount)
      .then(Promise.reject)
      .catch(res => {
        expect(res.status).toEqual(400);
      });
  });

  test('POST /signup with 409', () => {
    return accountMock.create()
      .then(mock => {
        return superagent.post(`${apiURL}/signup`).send({
          username: mock.request.username,
          email: mock.request.email,
          password: mock.request.password,
        });
      })
      .then(Promise.reject)
      .catch(res => {
        expect(res.status).toEqual(409);
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

    test('GET /login 400', () => {
      accountMock.create()
        .then(mock => {
          return superagent.get(`${apiURL}/login`)
            .auth(mock.username, mock.password);
        })
        .then(res => {
          expect(res.status).toEqual('400');
          expect(res.body.token).toBeTruthy();
        });
    });

    test('GET /login 401', () => {
      accountMock.create()
        .then(mock => {
          return superagent.get(`${apiURL}/login`)
            .auth(mock.request.username, 'bjhbnkjnm');
        })
        .then(res => {
          expect(res.status).toEqual(401);
        });
    });
  });
});

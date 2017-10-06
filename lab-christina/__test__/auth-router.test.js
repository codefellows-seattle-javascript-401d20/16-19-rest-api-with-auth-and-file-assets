require('./lib/setup.js');
const server = require('../lib/server.js');
const http = require('http');
const accountMock = require('./lib/account-mock.js');
const apiURL = `hhtp://localhost:${process.env.PORT}`;
const superagent = require('superagent');

describe('AUTH router', () => {
  beforeAll(server.start)
  afterAll(server.stop)
  afterEach(accountMock.remove)

  test('POST /signup with 200', () => {
    return superagent.post(`${apiURL}/signup`)
    .send({
      userName: 'penssake',
      email: 'penssake@test.com',
      password: 'secret',
    })
    .then(response => {
      expect(response.status).toEqual(200);
      expect(response.body.token).toBeTruthy();
    })
  })

  test('POST /signup with 400 no userName provided', () => {
    return superagent.post(`${apiURL}/signup`)
    .send({
      email: 'penssake@test.com',
      password: 'secret',
    })
    .then(Promise.reject)
    .catch(response => {
      expect(response.status).toEqual(400);
    });
  });

  test('POST /signup with 400 no email provided', () => {
    return superagent.post(`${apiURL}/signup`)
    .send({
      userName: 'penssake',
      password: 'secret',
    })
    .then(Promise.reject)
    .catch(response => {
      expect(response.status).toEqual(400);
    });
  });

  test('POST /signup with 400 no password provided', () => {
    return superagent.post(`${apiURL}/signup`)
    .send({
      userName: 'penssake',
      password: 'secret',
    })
    .then(Promise.reject)
    .catch(response => {
      expect(response.status).toEqual(400);
    });


});
});

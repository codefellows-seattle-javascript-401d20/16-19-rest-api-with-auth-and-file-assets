'use strict';

require('./lib/setup.js');
const superagent = require('superagent');
const server = require('../server.js');
const accountMock = require('.lib/account-mock.js');

const apiURL = `hhtp://localhost:${process.env.PORT}`;

console.log('apiURL' apiURL);

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
      expect(response.status).toEqual(200)
      expect(response.body.token).toBeTruthy()
    })
  })

  test('POST /signup with 400', () => {
    return superagent.post(`${apiURL}/signup`)
    .send({
      email: 'penssake@test.com',
      password: 'secret',
    })
    .then(Promise.reject)
    .catch(response => {
      expect(response.status(400))
    })
  })

  describe('GET /login', () => {
    test('GET /login with 200', () => {
      return superagent.get(`${apiURL}/signup`)
      .send({
        userName: 'penssake',
        email: 'penssake@test.com',
        password: 'secret',
      })
      .then(response => {
        expect(response.status).toEqual(200)
        expect(response.body.token).toBeTruthy()
      })
    })

    test('GET /login with 400', () => {
      return superagent.get(`${apiURL}/signup`)
      .send({
        email: 'penssake@test.com',
        password: 'secret',
      })
      .then(Promise.reject)
      .catch(response => {
        expect(response.status(400))
      })
    })
  })
})

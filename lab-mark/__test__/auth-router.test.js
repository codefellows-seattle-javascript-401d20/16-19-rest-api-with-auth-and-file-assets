'use strict';

// Load mock environment
require('./lib/setup.js');

const superagent = require('superagent');
const server = require('../lib/server.js');
const accountMock = require('./lib/account-mock.js');
const faker = require('faker');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('AUTH router', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(accountMock.remove);

  describe('/signup', () => {
    test('POST /signup with 200', () => {
      return superagent.post(`${apiURL}/signup`)
        .send({
          username: 'MackAttack87',
          email: 'MackAttack@gmail.com',
          password: '1234password',
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.token).toBeTruthy();
        });
    });

    test('POST /signup with 400', () => {
      return superagent.post(`${apiURL}/signup`)
        .send({
          email: 'MackAttack@gmail.com',
          password: '1234wontwork',
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });

    test('POST /signup with 409', () => {
      return superagent.post(`${apiURL}/signup`)
        .send({
          username: 'MackAttack87',
          email: 'MackAttack@gmail.com',
          password: '1234password',
        })
        .then(() => {
          // Same username signing up
          return superagent.post(`${apiURL}/signup`)
            .send({
              username: 'MackAttack87',
              email: 'DiffEmail@gmail.com',
              password: '1234anotherPassword',
            });
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(409);
        });
    });
  });
  describe('/login', () => {
    test('GET /login with 200',() => {
      let mockPassword = faker.internet.password();
      return accountMock.create(mockPassword)
        .then(mock => {
          return superagent.get(`${apiURL}/login`)
            .auth(mock.request.username, mockPassword);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.token).toBeTruthy();
        });
    });

    test('GET /login with 401',() => {
      let mockPassword = faker.internet.password();
      return accountMock.create(mockPassword)
        .then(mock => {
          return superagent.get(`${apiURL}/login`)
            .auth(mock.request.username, 'lulwat');
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });

    test('GET /login with 400',() => {
      let mockPassword = faker.internet.password();
      return accountMock.create(mockPassword)
        .then(() => {
          return superagent.get(`${apiURL}/login`);
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });

    test('GET /login with 404',() => {
      let mockPassword = faker.internet.password();
      return accountMock.create(mockPassword)
        .then(() => {
          return superagent.get(`${apiURL}/login`)
            .auth('ThisUserDoesNotExist', mockPassword);
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });

  });
});

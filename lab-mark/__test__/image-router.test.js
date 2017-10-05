'use strict';

require('./lib/setup.js');

const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server.js');
const imageMock = require('./lib/image-mock.js');
const accountMock = require('./lib/account-mock.js');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('/images', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(imageMock.remove);

  describe('POST /images', () => {
    test('200', () => {
      let tempAccountMock;
      return accountMock.create(faker.internet.password())
        .then(accountMock => {
          tempAccountMock = accountMock;
          return superagent.post(`${apiURL}/images`)
            .set('Authorization', `Bearer ${accountMock.token}`)
            .field('title', 'Chillax Dog')
            .field('description', 'A dog that is chillin')
            .attach('image', `${__dirname}/asset/dog.jpg`)
            .then(res => {
              expect(res.status).toEqual(200);
              expect(res.body.title).toEqual('Chillax Dog');
              expect(res.body.description).toEqual('A dog that is chillin');
              expect(res.body._id).toBeTruthy();
              expect(res.body.url).toBeTruthy();
              expect(res.body.account).toEqual(tempAccountMock.account._id.toString());
            });
        });
    });

    test('400 mispelled title', () => {
      return accountMock.create(faker.internet.password())
        .then(accountMock => {
          return superagent.post(`${apiURL}/images`)
            .set('Authorization', `Bearer ${accountMock.token}`)
            .field('tile', 'Chillax Dog')
            .field('description', 'A dog that is chillin')
            .attach('image', `${__dirname}/asset/dog.jpg`)
            .then(Promise.reject)
            .catch(res => {
              expect(res.status).toEqual(400);
            });
        });
    });

    test('401 bad token', () => {
      return accountMock.create(faker.internet.password())
        .then(() => {
          return superagent.post(`${apiURL}/images`)
            .set('Authorization', `Bearer bad-token`)
            .field('tile', 'Chillax Dog')
            .field('description', 'A dog that is chillin')
            .attach('image', `${__dirname}/asset/dog.jpg`)
            .then(Promise.reject)
            .catch(res => {
              expect(res.status).toEqual(401);
            });
        });
    });
  });

  describe('GET /images', () => {
    test('200', () => {
      return imageMock.create()
        .then(result => {
          return superagent.get(`${apiURL}/images/${result.image._id}`)
            .set('Authorization', `Bearer ${result.token}`);
        })
        .then(res => {
          expect(res.body.Body).toBeTruthy();
          expect(res.status).toEqual(200);
        });
    });

    test('404 bad id', () => {
      return imageMock.create()
        .then(result => {
          return superagent.get(`${apiURL}/images/bad-id`)
            .set('Authorization', `Bearer ${result.token}`);
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });

    test('401 bad token', () => {
      return imageMock.create()
        .then(result => {
          return superagent.get(`${apiURL}/images/${result.image._id}`)
            .set('Authorization', `Bearer bad-token`);
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });
  });

  describe('DELETE /images  200', () => {
    test('200', () => {
      return accountMock.create(faker.internet.password())
        .then(() => {
          return imageMock.create()
            .then(result => {
              return superagent.delete(`${apiURL}/images/${result.image._id}`)
                .set('Authorization', `Bearer ${result.token}`);
            })
            .then(res => {
              expect(res.status).toEqual(204);
            });
        });
    });

    test('404 bad id', () => {
      return imageMock.create()
        .then(result => {
          return superagent.delete(`${apiURL}/images/bad-id`)
            .set('Authorization', `Bearer ${result.token}`);
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });

    test('401 bad token', () => {
      return imageMock.create()
        .then(result => {
          return superagent.delete(`${apiURL}/images/${result.image._id}`)
            .set('Authorization', `Bearer bad-token`);
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });
  });
});

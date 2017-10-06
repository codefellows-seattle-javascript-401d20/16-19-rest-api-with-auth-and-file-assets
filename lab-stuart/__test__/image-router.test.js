'use strict';

require('./lib/setup.js');

const superagent = require('superagent');
const server = require('../lib/server.js');
const accountMock = require('./lib/account-mock.js');
const imageMock = require('./lib/image-mock.js');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('/images', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(imageMock.remove);

  describe('POST /images', () => {
    test('POST /images 200 should return an image', () => {
      let tempAccountMock;
      return accountMock.create()
      .then(accountMock => {
        tempAccountMock = accountMock;
        return superagent.post(`${apiURL}/images`)
        .set('Authorization', `Bearer ${accountMock.token}`)
        .field('title', 'delicious cheesy sandwich')
        .attach('image', `${__dirname}/asset/sandwich.jpg`)
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.title).toEqual('delicious cheesy sandwich');
          expect(res.body._id).toBeTruthy();
          expect(res.body.url).toBeTruthy();
          expect(res.body.account).toEqual(tempAccountMock.account._id.toString());
        });
      });
    });

    test('POST /images  400 due to missing Authorization header', () => {
      let tempAccountMock;
      return accountMock.create()
      .then(accountMock => {
        tempAccountMock = accountMock;
        return superagent.post(`${apiURL}/images`)
        .field('title', 'delicious cheesy sandwich')
        .attach('image', `${__dirname}/asset/sandwich.jpg`)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
      });
    });

    test('POST /images  401 due to bad token', () => {
      let tempAccountMock;
      return accountMock.create()
      .then(accountMock => {
        tempAccountMock = accountMock;
        return superagent.post(`${apiURL}/images`)
        .set('Authorization', `Bearer badToken`)
        .field('title', 'delicious cheesy sandwich')
        .attach('image', `${__dirname}/asset/sandwich.jpg`)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(401);
        });
      });
    });
  });

  describe('GET /images', () => {
    test('GET /images/:id 200', () => {
      let tempMock;
      return imageMock.create()
      .then(mock => {
        tempMock = mock;
        return superagent.get(`${apiURL}/images/${mock.image._id}`)
        .set('Authorization', `Bearer ${mock.tempAccount.token}`)
        .then(res => {
          expect(res.status).toEqual(200);
        });
      });
    });

    test('GET /images/:id 401', () => {
      let tempMock;
      return imageMock.create()
      .then(mock => {
        tempMock = mock;
        return superagent.get(`${apiURL}/images/${mock.image._id}`)
        .set('Authorization', `Bearer badToken`)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(401);
        });
      });
    });

    test('GET /images/:id 404', () => {
      let tempMock;
      return imageMock.create()
      .then(mock => {
        tempMock = mock;
        return superagent.get(`${apiURL}/images/badId`)
        .set('Authorization', `Bearer ${mock.tempAccount.token}`)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
      });
    });
  });

  describe('DELETE /images', () => {
    test('DELETE /images/:id 200', () => {
      let tempMock;
      return imageMock.create()
      .then(mock => {
        tempMock = mock;
        return superagent.delete(`${apiURL}/images/${mock.image._id}`)
        .set('Authorization', `Bearer ${mock.tempAccount.token}`)
        .then(res => {
          expect(res.status).toEqual(204);
        });
      });
    });

    test('DELETE /images/:id 401', () => {
      let tempMock;
      return imageMock.create()
      .then(mock => {
        tempMock = mock;
        return superagent.delete(`${apiURL}/images/${mock.image._id}`)
        .set('Authorization', `Bearer badToken`)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(401);
        });
      });
    });

    test('DELETE /images/:id 404', () => {
      let tempMock;
      return imageMock.create()
      .then(mock => {
        tempMock = mock;
        return superagent.delete(`${apiURL}/images/badId`)
        .set('Authorization', `Bearer ${mock.tempAccount.token}`)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
      });
    });
  });
});

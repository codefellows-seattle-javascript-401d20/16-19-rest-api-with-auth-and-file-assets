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
    test('POST /images  200', () => {
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
          expect(res.body.url).toEqual(tempMock.image.url);
          expect(res.body.title).toEqual(tempMock.image.title);
          expect(res.body._id).toEqual(tempMock.image._id.toString());
          expect(res.body.account).toEqual(tempMock.tempAccount.account._id.toString());
        });
      });
    });

    test('GET /images/:id 400 due to missing Authorization header', () => {
      let tempMock;
      return imageMock.create()
      .then(mock => {
        tempMock = mock;
        return superagent.get(`${apiURL}/images/${mock.image._id}`)
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
      });
    });

    test('GET /images/:id 401 due to bad token', () => {
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
  });
});

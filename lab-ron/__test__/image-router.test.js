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
    test('200 OK', () => {
      let tempAccountMock;
      return accountMock.create()
        .then(accountMock => {
          tempAccountMock = accountMock;
          return superagent.post(`${apiURL}/images`)
            .set('Authorization', `Bearer ${accountMock.token}`)
            .field('title', 'coder doge')
            .field('alt', 'doge image')
            .field('description', 'This is the doge image')
            .attach('image', `${__dirname}/asset/doge.jpg`)
            .then(res => {
              expect(res.status).toEqual(200);
              expect(res.body.title).toEqual('coder doge');
              expect(res.body._id).toBeTruthy();
              expect(res.body.url).toBeTruthy();
              expect(res.body.alt).toEqual('doge image');
              expect(res.body.description).toEqual('This is the doge image');
              expect(res.body.account).toEqual(tempAccountMock.account._id.toString());
            });
        });
    });

    test('400 Bad Request - missing title and image', () => {
      return accountMock.create()
        .then(accountMock => {
          return superagent.post(`${apiURL}/images`)
            .set('Authorization', `Bearer ${accountMock.token}`)
            .field('description', 'This is the doge image')
            .then(Promise.reject)
            .catch(res => {
              expect(res.status).toEqual(400);
            });
        });
    });

    test('401 Bad Token', () => {
      return accountMock.create()
        .then(() => {
          return superagent.post(`${apiURL}/images`)
            .set('Authorization', `Bearer bad.token.here`)
            .attach('image', `${__dirname}/asset/doge.jpg`)
            .then(Promise.reject)
            .catch(res => {
              expect(res.status).toEqual(401);
            });
        });
    });

    test('400 Bad Request ', () => {
      return accountMock.create()
        .then(() => {
          return superagent.post(`${apiURL}/images`)
            .attach('image', `${__dirname}/asset/doge.jpg`)
            .then(Promise.reject)
            .catch(res => {
              expect(res.status).toEqual(400);
            });
        });
    });
  });

  describe('GET /images', () => {
    test('200 OK', () => {
      return imageMock.create()
        .then(mock => {
          return superagent.get(`${apiURL}/images/${mock.image._id}`)
            .set('Authorization', `Bearer ${mock.accountMock.token}`)
            .then(res => {
              expect(res.status).toEqual(200);
            });
        });
    });
    test('404 image not found', () => {
      return imageMock.create()
        .then(() => {
          return superagent.get(`${apiURL}/images/No_Image_for_you`)
            .then(Promise.reject)
            .catch(res => {
              expect(res.status).toEqual(404);
            });
        });
    });
  });
  describe('DELETE /images', () => {
    test('204 /image/:id deleted', () => {
      return imageMock.create()
        .then(mock => {
          return superagent.delete(`${apiURL}/images/${mock.image._id}`)
            .set('Authorization', `Bearer ${mock.accountMock.token}`)
            .then(res => {
              expect(res.status).toEqual(204);
            });
        });
    });

    test('401 /image/:id Not Authorized', () => {
      return imageMock.create()
        .then(mock => {
          return superagent.delete(`${apiURL}/images/${mock.image._id}`)
            .set('Authorization', `Bearer bad.token.here`)
            .then(Promise.reject)
            .catch(res => {
              expect(res.status).toEqual(401);
            });
        });
    });

    test('400 /image/:id No Header', () => {
      return imageMock.create()
        .then(mock => {
          return superagent.delete(`${apiURL}/images/${mock.image._id}`)
            .then(Promise.reject)
            .catch(res => {
              expect(res.status).toEqual(400);
            });
        });
    });

    test('404 /image/:id Not found', () => { });
    return imageMock.create()
      .then(mock => {
        return superagent.delete(`${apiURL}/images/No_Image_For_You`)
          .set('Authorization', `Bearer ${mock.accountMock.token}`)
          .then(Promise.reject)
          .catch(res => {
            expect(res.status).toEqual(404);
          });
      });
  });
});








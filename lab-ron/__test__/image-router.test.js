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

  test('POST /samples 200 OK', () => {
    let tempAccountMock;
    return accountMock.create()
      .then(accountMock => {
        tempAccountMock = accountMock;

        return superagent.post(`${apiURL}/samples`)
          .set('Authorization', `Bearer ${accountMock.token}`)

          .field('title', 'coder doge')
          .field('alt', 'doge image')
          .attach('image', `${__dirname}/asset/doge.jpg`)
          .then(res => {

            expect(res.status).toEqual(200);
            // expect(res.body.title).toEqual('coder doge');
            // expect(res.body._id).toBeTruthy();
            // expect(res.body.url).toBeTruthy();
            // expect(res.body.account).toEqual(tempAccountMock.account._id.toString());
          });
      });
  });
});
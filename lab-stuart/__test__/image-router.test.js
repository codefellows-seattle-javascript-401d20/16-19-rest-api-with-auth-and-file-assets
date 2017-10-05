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

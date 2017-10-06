'use strict';

require('./lib/setup.js');

const superagent = require('superagent');
const server = require('../lib/server.js');
const accountMock = require('./lib/account-mock.js');
const sandwichMock = require('./lib/sandwich-mock.js');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('/sandwiches', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(sandwichMock.remove);

  describe('POST /sandwiches', () => {
    test('POST /sandwiches 200 should return a sandwich', () => {
      let tempAccount;
      return accountMock.create()
      .then(mock => {
        tempAccount = mock;
        return superagent.post(`${apiURL}/sandwiches`)
        .set('Authorization', `Bearer ${tempAccount.token}`)
        .send({
          title: 'Badass Sammy',
          bread: 'White',
          cheese: 'Cheddar',
          spread: ['Mayo', 'Mustard'],
          veggies: ['Lettuce', 'Onions'],
        });
      })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body.account).toEqual(tempAccount.account._id.toString());
        expect(res.body.title).toEqual('Badass Sammy');
        expect(res.body.bread).toEqual('White');
        expect(res.body.cheese).toEqual('Cheddar');
        expect(res.body.spread).toEqual(['Mayo','Mustard']);
        expect(res.body.veggies).toEqual(['Lettuce', 'Onions']);
      });
    });

    test('POST /sandwiches 400 due to missing Authorization header', () => {
      return superagent.post(`${apiURL}/sandwiches`)
      .send({
        title: 'Badass Sammy',
        bread: 'White',
        cheese: 'Cheddar',
        spread: ['Mayo', 'Mustard'],
        veggies: ['Lettuce', 'Onions'],
      })
      .then(Promise.reject)
      .catch(res => {
        expect(res.status).toEqual(400);
      });
    });

    test('POST /sandwiches 401 due to bad token', () => {
      return superagent.post(`${apiURL}/sandwiches`)
      .set('Authorization', `Bearer badtoken`)
      .send({
        title: 'Badass Sammy',
        bread: 'White',
        cheese: 'Cheddar',
        spread: ['Mayo', 'Mustard'],
        veggies: ['Lettuce', 'Onions'],
      })
      .then(Promise.reject)
      .catch(res => {
        expect(res.status).toEqual(401);
      });
    });
  });

  describe('GET /sandwiches', () => {
    test('GET /sandwiches/:id 200', () => {
      let tempMock;
      return sandwichMock.create()
      .then(mock => {
        tempMock = mock;
        return superagent.get(`${apiURL}/sandwiches/${mock.sandwich._id}`)
        .set('Authorization', `Bearer ${mock.tempAccount.token}`)
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.title).toEqual(tempMock.sandwich.title);
          expect(res.body.bread).toEqual(tempMock.sandwich.bread);
          expect(res.body._id).toEqual(tempMock.sandwich._id.toString());
          expect(res.body.account).toEqual(tempMock.tempAccount.account._id.toString());
        });
      });
    });
  });

});

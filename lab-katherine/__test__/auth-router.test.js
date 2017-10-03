'use strict';

require('./lib/setup.js');
const superagent = require('superagent');
const server = require('../lib/server.js');
const accountMock = require('./lib/account-mock.js');

const apiURL = `http://localhost:${process.env.PORT}`;

console.log('apiURL', apiURL);
describe('AUTH router', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(accountMock.remove);

  test('POST /signup with 200', () => {
    return superagent.post(`${apiURL}/signup`)
      .send({
        username: 'khanson',
        email: 'khanson@gmail.com',
        password: 'himitsu',
      })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body.token).toBeTruthy();
      });
  });

  test('POST /signup with 400', () => {
    return superagent.post(`${apiURL}/signup`)
      .send({
        email: 'khanson@gmail.com',
        password: 'himitsu',
      })
      .then(Promise.reject)
      .catch(res => {
        expect(res.status).toEqual(400);
      });
  });

  test('POST /signup with 409', () => {
    return superagent.post(`${apiURL}/signup`)
      .send({
        username: 'katherineh',
        email: 'katherineh@gmail.com',
        password: 'pumpkinpieisgreat',
      })
      .then(() => {
        return superagent.post(`${apiURL}/signup`)
          .send({
            username: 'katherineh',
            email: 'katherineh@gmail.com',
            password: 'pumpkinpieisgreat',
          });
      })
      .then(Promise.reject)
      .catch(res => {
        expect(res.status).toEqual(409);
      });
  });
//   test('POST /signup with 409', () => {
//   return accountMock.create()
//     .then(account => {
//       return superagent.post(`${apiURL}/signup`)
//         .send({
//           username: account.username,
//           email: account.title,
//           password: account.password,
//         });
//     })
//     .then(Promise.reject)
//     .catch(res => {
//       expect(res.status).toEqual(409);
//     });
// });
});

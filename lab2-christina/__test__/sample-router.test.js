// 'use strict';
//
// require('./lib/setup.js');
// const superagent = require('superagent');
// const server = require('../lib/server.js');
// const accountMock = require('./lib/account-mock.js');
// const sampleMock = require('./lib/sample-mock.js');
//
// const apiURL = `http://localhost:${process.env.PORT}`;
//
// describe('/samples', () => {
//   beforeAll(server.start);
//   afterAll(server.stop);
//   afterEach(sampleMock.remove);
//
//   test('POST /samples 200', () => {
//     let tempAccountMock;
//     return accountMock.create()
//       .then(accountMock => {
//         tempAccountMock = accountMock;
//         return superagent.post(`${apiURL}/samples`)
//           .set('Authorization', `Bearer ${ accountMock.token }`)
//           .field('title', 'cat pic')
//           .attach(`${__dirname}/asset/cat.jpeg`)
//           .then(response => {
//             expect(response.status).toEqual(200);
//             expect(response.body.title).toEqual('cat pic');
//             expect(response.body._id).toBeTruthy();
//             expect(response.body.account).toEqual(tempAccountMock.account._id.toString());
//           });
//       });
//   });
// });

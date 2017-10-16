// 'use strict';
//
// require('./lib/setup.js');
// const superagent = require('superagent');
// const server = require('../lib/server.js');
// const accountMock = require('./lib/account-mock.js');
// const apiURL = `http://localhost:${process.env.PORT}`;
//
// describe('AUTH router', () => {
//   beforeAll(server.start)
//   afterAll(server.stop)
//   afterEach(accountMock.remove)
//
//   describe('POST /signup', () => {
//     test('POST /signup with 200', () => {
//       return superagent.post(`${apiURL}/signup`)
//       .send({
//         userName: 'penssake',
//         email: 'penssake@test.com',
//         password: 'secret',
//       })
//       .then(response => {
//         console.log(response);
//         expect(response.status).toEqual(200);
//         expect(response.body.token).toBeTruthy();
//       })
//     })
//     test('POST /signup with a 400', () => {
//       return superagent.post(`${apiURL}/signup`)
//       .send({
//         email: 'penssake@test.com',
//         password: 'secret',
//       })
//       .then(Promise.reject)
//       .catch(response => {
//         expect(response.status).toEqual(400)
//       })
//     })
//   })
//
//   describe('GET /login', () => {
//     test('GET /login 200', () => {
//       let tempMock;
//       accountMock.create()
//       .then(mock => {
//         tempMock = mock;
//         return superagent.get(`${apiURL}`)
//           .auth(mock.request.username, mock.request.password)
//       })
//       .then(response => {
//         expect(response.status).toEqual(200);
//         expect(response.body.token).toBeTruthy();
//       })
//     })
//     test('GET /login 401 due to bad password', () => {
//       let tempMock
//       accountMock.create()
//       .then(mock => {
//         tempMock = mock;
//         return superagent.get(`${apiURL}/login`)
//           .auth(mock.request.username, 'hello world')
//       })
//       .then(Promise.reject)
//       .catch(response => {
//         expect(response.status).toEqual(401);
//       })
//     })
//
//     test('GET /login 401 due to bad account', () => {
//       return superagent.get(`${apiURL}/login`)
//       .auth('bad_account_99', 'hello world')
//       .then(Promise.reject)
//       .catch(response => {
//         expect(response.status).toEqual(401)
//       })
//     })
//   })
// })

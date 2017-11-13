'use strict';

const { Router } = require('express');
const jsonParser = require('body-parser').json();
const Account = require('../model/account.js');
const httpErrors = require('http-errors');
const basicAuth = require('../lib/basic-auth-middleware.js');


module.exports = new Router()
  .post('/signup', jsonParser, (request, response, next) => {
    if(!request.body.username || !request.body.email || !request.body.password)
      return next(httpErrors(400, '__REQUEST_ERROR__ username, email, and password are required'));

    Account.create(request.body)
      .then(account => account.tokenCreate())
      .then(token => {
        response.json({token});
      })
      .catch(next);
  })

  .get('/login', basicAuth, (request, response, next) => {
    if(!request.account)
      return next(httpErrors(401, '__REQUEST_ERROR__account not found'));
    request.account.tokenCreate()
      .then(token => response.json({token}))
      .catch(next);
  });

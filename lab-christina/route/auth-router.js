'use strict';

const Router = require('express');
const jsonParser = require('body-parser').json();
const Account = require('../model/account.js');
const httpErrors = require('http-errors');

const authRouter = module.exports = new Router();

authRouter.post('/signup', jsonParser, (request, response, next) => {
    if(!request.body.userName || !request.body.email || !request.body.password)
      return next(httpErrors(400, '__REQUEST_ERROR__ username, email, and password are required'));

    Account.create(request.body)
      .then(user => user.tokenCreate())
      .then(token => response.json({token}))
      .catch(next);
  })
  authRouter.get('/login', () => {

  })

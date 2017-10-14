'use strict';

const { Router } = require('express');
const jsonParser = require('body-parser').json();
const Account = require('../model/account.js');
const httpErrors = require('http-errors');
const basicAuth = require('../lib/basic-auth-middleware.js');

module.exports = new Router()
  .post('/signup', jsonParser, (req, res, next) => {
    if (!req.body.username || !req.body.email || !req.body.password)
      return next(httpErrors(400, 'REQUEST ERROR: username, email, and password are required'));

    Account.create(req.body)
      .then(user => user.tokenCreate())
      .then(token => {
        res.cookie('Imagr-Token', token, { maxAge: 604800000 });
        res.json({ token });
      })
      .catch(next);
  })

  .get('/login', basicAuth, (req, res, next) => {
    req.account.tokenCreate()
      .then(token => {
        res.cookie('Imagr-Token', token, { maxAge: 604800000 });
        res.json({ token });
      })
      .catch(next);
  });
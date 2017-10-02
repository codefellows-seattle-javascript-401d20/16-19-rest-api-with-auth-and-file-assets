'use strict';

const {Router} = require('express');
const Account = require('../model/account.js');
const httpErrors = require('http-errors');

const authRouter = module.exports = new Router();

authRouter.post('/signup', (req, res, next) => {
  if(!req.body.username || !req.body.email || !req.body.password)
    return next(httpErrors(400, '__REQUEST_ERROR__ username, email, and password are required'));

  Account.create(req.body)
    .then(user => user.tokenCreate())
    .then(token => res.json({token}))
    .catch(next);
});

authRouter.get('/login', () => {
});

'use strict';

const {Router} = require('express');
const Account = require('../model/account.js');
const basicAuth = require('../lib/basic-auth-middleware.js');

const authRouter = module.exports = new Router();

authRouter.post('/signup', (req, res, next) => {
  Account.create(req.body)
    .then(account => account.tokenCreate())
    .then(token => res.json({token}))
    .catch(next);
});

authRouter.get('/login', basicAuth, (req, res, next) => {
  req.account.tokenCreate()
    .then(token => res.json({token}))
    .catch(next);
});

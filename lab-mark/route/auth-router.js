'use strict';

const {Router} = require('express');
const Account = require('../model/account.js');
const httpErrors = require('http-errors');

const authRouter = module.exports = new Router();

authRouter.post('/signup', (req, res, next) => {
  Account.create(req.body)
    .then(account => account.tokenCreate())
    .then(token => res.json({token}))
    .catch(next);
});

authRouter.get('/login', (req, res, next) => {
  let accountCache;
  Account.findOne({username: req.query.username})
    .then(account => {
      if(!account)
        throw httpErrors(404, '__REQUEST_ERROR__ account does not exist');
      accountCache = account;
      return account.passwordVerify(req.query.password);
    })
    .then(() => accountCache.tokenCreate())
    .then(token => res.json({token}))
    .catch(next);
});

'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const Account = require('../model/useraccount.js');
const httpErrors = require('http-errors');

const authRouter = new Router();

module.exports = authRouter;

authRouter.post('/signup', jsonParser, (req, res, next) => {
  if(!req.body.username || !req.body.email || !req.body.password)
    return next(httpErrors(400, '__REQUEST_ERROR__ username, email, and password are required'));
  Account.create(req.body)
    .then(user => user.tokenCreate())
    .then(token => res.json({token}))
    .catch(next);
});

authRouter.get('/login', (req, res) => {

});

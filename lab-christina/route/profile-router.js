'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Profile = require('../model/profile.js');

module.exports = new Router()
.post('/profiles', bearerAuth jsonParser, (request, response, next) => {
  if(!request.account)
    return next(httpErrors(401, '__REQUEST_ERROR__no account found'))
  return new Profile({
    ...request.body,
    account: request.account._id,
    userName: request.account.userName,
    email: request.account.email,
  }).save();
  .then(profile => response.json(profile))
  .catch(next)
})

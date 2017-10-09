'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const Profile = require('../model/profile.js');
const httpErrors = require('http-errors');
const bearerAuth = require('../lib/bear-auth-midleware.js');

module.exports = new Router()
.post('/profiles', bearerAuth, jsonParser, (request, response, next) => {
  if(!request.account)
    return next(httpErrors(400, '__REQUEST_ERROR__ username, email, and password are required'));
  return new Profile({
    ...request.body,
    account: request.account._id,
    username: request.account.username,
    email: request.account.email,
  }).save()
  .then(profile => response.json(profile))
  .catch(next);
});

'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Profile = require('../model/profile.js');

module.exports = new Router()
 .post('/profiles', bearerAuth, (request, response, next) => {
   return new Profile({
     ...request.body,
     account: request.account._id,
     username: request.account.username,
     email: request.account.email,
   }).save()
     .then(profile => {
       response.json(profile);
     })
     .catch(next);
 })
.get('/profiles/:id', bearerAuth, (request, response, next) => {
  Profile.findById(request.params.id)
    .then(profile => {
      if(!profile)
        throw httpErrors(404, '__REQUEST_ERROR__ profile not found');
    response.json(profile);
})
.catch(next);
});

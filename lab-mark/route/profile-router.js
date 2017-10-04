'use strict';

const {Router} = require('express');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Profile = require('../model/profile.js');

const profileRouter = module.exports = new Router();

profileRouter.post('/profiles', bearerAuth, (req, res, next) => {
  return new Profile({
    ...req.body,
    account: req.account._id,
    username: req.account.username,
    email: req.account.email,
  }).save()
  .then(profile => res.json(profile))
  .catch(next)
});

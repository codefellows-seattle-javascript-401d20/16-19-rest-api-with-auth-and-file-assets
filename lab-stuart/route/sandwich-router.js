'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Sandwich = require('../model/sandwich.js');

module.exports = new Router()
.post('/sandwiches', bearerAuth, jsonParser, (req, res, next) => {
  if(!req.account)
    return next(httpErrors(401, '::REQUEST_ERROR:: no account found'));
  return new Sandwich({
    ...req.body,
    account: req.account._id,
  }).save()
  .then(sandwich => res.json(sandwich))
  .catch(next)
})
.get('/sandwiches/:id', bearerAuth, (req, res, next) => {
  Sandwich.findById(req.params.id)
  .then(sandwich => {
    if(!sandwich)
      throw httpErrors(404, '::REQUEST_ERROR:: sandwich not found');
    res.json(sandwich);
  })
  .catch(next);
});

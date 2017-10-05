'use strict';

const jwt = require('jsonwebtoken');
const httpErrors = require('http-errors');
const Account = require('../model/account.js');

const promisify = (fn) => (...args) => {
  return new Promise((resolve, reject) => {
    fn(...args, (err, data) => {
      if(err) return reject(err);
      resolve(data);
    });
  });
};

module.exports = (request, response, next) => {
  if(!request.headers.authorization)
    return next(httpErrors(400, '__REQUEST_ERROR__ authorization header required'));

  const token = request.headers.authorization.split('Bearer ')[1];
  if(!token)
    return next(httpErrors(400, '__REQUEST_ERROR__ Basic auth required'));

  promisify(jwt.verify)(token, process.env.CHRISTINAS_SECRET)
    .catch(error => Promise.reject(httpErrors(401, error)))//This line confuses me
    .then((decrypted) => {
      return Account.finOne({tokenSeed: decrypted.tokenSeed});
    })
    .then(account => {
      if(!account)
        throw httpErrors(401, '__REQUEST_ERROR__account not found');
      request.account = account;
      next();
    })
    .catch();
};

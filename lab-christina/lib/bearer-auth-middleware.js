'use strict';

const jwt = require('jsonwebtoken');
const httpErrors = require('http-errors');
const Account = require('../model/account.js');

const promisify = (fn) => (...args) => {
  return new Promise((resolve, reject) => {
    fn(...args, (err, data) => {
      if(err) return reject(err)
      resolve(data)
    })
  })
}

module.exports = (request, response, next) => {
  if(!request.headers.authorization)
    return next(httpErrors(400, '__REQUEST_ERROR__ authorization header required'));

  const token = request.headers.authorization.split('Bearer ')[1];
  if(!token)
    return next(httpErrors(401, '__REQuEST_ERROR__ unauthorized'));

  promisify(jwt.verify)(token, process.env.CHRISTY_SECRET)
    .catch(err => Promise.reject(httpErrors(401, err)))
    .then(decrypted => {
      return Account.findOne({tokenSeed: decrypted.tokenSeed});
    })
    .then(account => {
      request.account = account;
      next();
    })
    .catch(next);
};

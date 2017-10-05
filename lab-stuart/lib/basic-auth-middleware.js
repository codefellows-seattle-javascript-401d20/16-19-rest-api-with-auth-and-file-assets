'use strict';

const httpErrors = require('http-errors');
const Account = require('../model/account.js');

module.exports = (req, res, next) => {
  if(!req.headers.authorization)
    return next(httpErrors(400, '::REQUEST_ERROR:: authorization header required'));
  const encoded = req.headers.authorization.split('Basic ')[1];
  if(!encoded)
    return next(httpErrors(400, '::REQUEST_ERROR:: Basic auth required'));
  let decoded = new Buffer(encoded, 'base64').toString();
  let [username, password] = decoded.split(':');
  if(!username || !password)
    return next(httpErrors(400, '::REQUEST_ERROR:: username and password are required'));
  Account.findOne({username})
  .then(account => {
    if(!account)
      throw httpErrors(401, '::REQUEST_ERROR:: account not found');
    return account.passwordVerify(password);
  })
  .then(account => {
    req.account = account;
    next();
  })
  .catch(next);
}

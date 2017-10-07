'use strict';

const httpErrors = require('http-errors');
const Account = require('../model/account.js');

module.exports = (req, res, next) => {
  if (!req.headers.authorization)
    return next(httpErrors(400, 'REQUEST ERROR: authorization header required'));

  const encoded = req.headers.authorization.split('Basic ')[1];
  if (!encoded)
    return next(httpErrors(400, 'REQUEST ERROR: account not found'));
  let decoded = new Buffer(encoded, 'base64').toString();
  let [username, password] = decoded.split(':');
  if (!username || !password)
    return next(httpErrors(400, 'REQUEST ERROR: username and password are required'));

  Account.findOne({ username })
    .then(account => {
      if (!account)
        throw httpErrors(401, 'REQUEST ERROR: account not found');
      return account.passwordVerify(password);
    })
    .then(account => {
      req.account = account;
      next();
    })
    .catch(next);

};
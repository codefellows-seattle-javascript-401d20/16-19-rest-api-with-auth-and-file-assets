'use strict';

const httpErrors = require('http-errors');
const Account = require('../model/account.js');

module.exports = (request, response, next) => {
  if(!request.headers.authorization)
    return next(httpErrors(400, '__REQUEST_ERROR__authorization header required'));

  const encoded = request.headers.authorization.split('basic')[1];
  if(!encoded)
    return next(httpErrors(400, '__basic auth required'));
  let decoded = new Buffer(encoded, 'base64').toString();
  let [username, password] = decoded.split(':')
  if(!username || !password)
    return next(httpErrors(400, '__REQUEST_ERROR__username and password are required'));

  Account.findOne({username})
  .then(account => {
    if(!account)
      throw next(httpErrors(401, '__REQUEST_ERROR__account not found'))
    return account.passwordVerify(password)
  })
  .then(account => {
    request.account = account;
    next();
    })
  })
  .catch(next);
}

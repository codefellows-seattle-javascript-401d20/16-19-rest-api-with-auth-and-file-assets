'use strict';

// require packages
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const httpErrors = require('http-errors');

// create user documents
const useraccountSchema  = mongoose.Schema({
  passwordHash: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  username: {type: String, required: true, unique: true},
  tokenSeed: {type: String, required: true, unique: true},
  created: {type: Date, default: () => new Date()},
});

// login / password verification
useraccountSchema.methods.passwordVerify = function(password){
  return bcrypt.compare(password, this.passwordHash)
    .then(correctPassword => {
      if(!correctPassword)
        throw httpErrors(401, '__AUTH_ERROR__ incorrect password');
      return this;
    });
};

useraccountSchema.methods.tokenCreate = function(){
  this.tokenSeed = crypto.randomBytes(64).toString('hex');
  return this.save()
    .then(account => {
      return jwt.sign({tokenSeed: account.tokenSeed}, process.env.SUPERDUPER_SECRET);
    });
};

const Account = module.exports = mongoose.model('account', useraccountSchema);

// data is going to contain {username, email, and password}
Account.create = function(data){
  // hash password
  let {password} = data;
  delete data.password;
  return bcrypt.hash(password, 8)
    .then(passwordHash => {
      data.passwordHash = passwordHash;
      // generate a token seed
      data.tokenSeed = crypto.randomBytes(64).toString('hex');
      // create an account
      return new Account(data).save();
      // save account
    });
};

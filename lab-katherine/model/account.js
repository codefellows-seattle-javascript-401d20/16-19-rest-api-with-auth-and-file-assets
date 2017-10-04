'use strict';

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const httpErrors = require('http-errors');

const accountSchema  = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  passwordHash: {type: String, required: true},
  tokenSeed: {type: String, required: true, unique: true},
  created: {type: Date, default: () => new Date()},
});

accountSchema.methods.passwordVerify = function(password){
  return bcrypt.compare(password, this.passwordHash)
    .then(correctPassword => {
      if(!correctPassword)
        throw httpErrors(401, '__AUTH_ERROR__ incorrect password');
      return this;
    });
};

accountSchema.methods.tokenCreate = function(){
  this.tokenSeed = crypto.randomBytes(64).toString('hex');
  return this.save()
    .then(account => {
      return jwt.sign({tokenSeed: account.tokenSeed}, process.env.LABKATHERINE_SECRET);
    });
};

const Account = module.exports = mongoose.model('account', accountSchema);

Account.create = function(data){
  data = {...data}
  let {password} = data;
  delete data.password;
  return bcrypt.hash(password, 8)
    .then(passwordHash => {
      data.passwordHash = passwordHash;
      data.tokenSeed = crypto.randomBytes(64).toString('hex');
      return new Account(data).save();
    });
};

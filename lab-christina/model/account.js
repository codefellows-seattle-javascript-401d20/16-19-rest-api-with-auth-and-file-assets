'use strict';

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const httpErrors = require('http-errors');

const accountSchema = mongoose.Schema({
  passwordHash: {type: String, required: true},
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  tokenSeed: {type: String, required: true, unique: true},
  created: {type: Date, default: () => new Date()},
});

accountSchema.methods.passwordVerify = function(password) {
  return bcrypt.compare(password, this.passwordHash)
    .then(correctPassword => {
      if(!correctPassword)
        throw httpErrors(401, '__AUTH_ERROR__ incorrect password');
      return this;
    });
};

accountSchema.methods.createToken = function(){//why not arrow function
  this.tokenSeed = crypto.randomBytes(64).toString('hex');
  return this.save()
    .then(account => {
      return jwt.sign({tokenSeed: account.tokenSeed}, process.env.CHRISTINAS_SECRET, options);
    });
};

const Account = module.exports = mongoose.model('account', accountSchema);

Account.create = function(data){
  data = {...data}
  //hash password
  let {password} = data;
  delete data.password;
  return bcrypt.hash(password, 8)//not linier growing by multiples
    .then(passwordHash => {
      data.passwordHash = passwordHash;
      data.toTokenSeed = crypto.randomBytes(64).toString('hex');
      //create the account save the acocunt
      return new Account(data).save();
    });
};

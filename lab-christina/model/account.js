'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
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
  this.save()
    .then(user => {
      return jwt.sign({tokenSeed: user.tokenSeed}, process.env.CHRISTINAS_SECRET);
    });
};

const Account = module.exports = mongoose.model('account', accountSchema);

Account.create = function(data){
  let password = data;
  delete data.password;
  return bcrypt.hash(password, 8)//not linier growing by multiples
    .then(passwordHash => {
      data.passwordHash = passwordHash;
      data.toTokenSeed = crypto.randomBytes(32).toString('hex');
      return new Account(data).save();
    });
};

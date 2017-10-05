'use strict';

const { Router } = require('express');
const multer = require('multer');
const httpErrors = require('http-errors');
const s3 = require('../lib/s3.js');
const Image = require('../model/image.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const upload = multer({ dest: `${__dirname}/../temp` });

module.exports = new Router()
  .post('/images', bearerAuth, upload.any(), (req, res, next) => {

    if (!req.account)
      return next(httpErrors(401, 'REQUEST ERROR: account not found'));
    if (!req.body.title || req.files.length > 1 || req.files[0].fieldname !== 'image')
      return next(httpErrors(401, 'REQUEST ERROR: title or image not provided'));

    let file = req.files[0];
    console.log(file);

    let key = `${file.filename}.${file.originalname}`;
    return s3.upload(file.path, key)
      .then(url => {
        console.log('img URL', url);
        return new Image({
          title: req.body.title,
          account: req.account._id,
          url,
        }).save();
      })
      .then(image => res.json(image))
      .catch(next);

  });
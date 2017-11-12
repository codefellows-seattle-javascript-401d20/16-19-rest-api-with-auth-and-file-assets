'use strict';

const multer = require('multer');
const s3 = require('../lib/s3.js');
const { Router } = require('express');
const httpErrors = require('http-errors');
const Image = require('../model/image.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const upload = multer({ dest: `${__dirname}/../temp` });

module.exports = new Router()
  .post('/images', bearerAuth, upload.any(), (req, res, next) => {
    if (!req.body.title || req.files.length > 1 || req.files[0].fieldname !== 'image')
      return next(httpErrors(400, 'REQUEST_ERROR: title or image was not provided'));

    let file = req.files[0];

    let key = `${file.filename}.${file.originalname}`;
    return s3.upload(file.path, key) /// all I need to send things to aws
      .then(url => {
        return new Image({
          title: req.body.title,
          account: req.account._id,
          description: req.body.description,
          alt: req.body.alt,
          url,
        }).save();
      })
      .then(image => res.json(image))
      .catch(next);
  })

  .get('/images/:id', (req, res, next) => {
    Image.findById(req.params.id)
      .then(image => {
        res.json(image);
      })
      .catch(next);
  })

  .delete('/images/:id', bearerAuth, (req, res, next) => {
    Image.findByIdAndRemove(req.params.id)
      .then(() => {
        res.sendStatus(204);
      })
      .catch(next);
  });


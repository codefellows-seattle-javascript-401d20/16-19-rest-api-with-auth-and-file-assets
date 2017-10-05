'use strict';

const fs = require('fs-extra');
const multer = require('multer');
const s3 = require('../lib/s3.js');
const {Router} = require('express');
const httpErrors = require('http-errors');
const Image = require('../model/image.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const upload = multer({dest: `${__dirname}/../temp`});

const imageRouter = module.exports = new Router();

imageRouter.post('/images', bearerAuth, upload.any(), (req, res, next) => {

  if(!req.body.title || req.files.length > 1 || req.files[0].fieldname !== 'image') {
    return Promise.all(req.files.map(file => fs.remove(file.path)))
      .then(() => {
        throw httpErrors(400, '__REQUEST_ERROR__ title or image was not provided');
      })
      .catch(next);
  }

  let file = req.files[0];

  let key = `${file.filename}.${file.originalname}`;
  return s3.upload(file.path, key)
    .then(url => {
      return new Image({
        title: req.body.title,
        description: req.body.description,
        account: req.account._id,
        url,
      }).save();
    })
    .then(image => res.json(image))
    .catch(next);
});

imageRouter.get('/images/:id', bearerAuth, (req, res, next) => {

  Image.findById(req.params.id)
    .then(image => {
      if(!image)
        throw httpErrors(404, 'no image exists with that ID');
      return s3.get(image.url)
        .then(image => {
          if(!image)
            throw httpErrors(404, 'image not found');
          res.json(image);
        });
    })
    .catch(next);
});

imageRouter.delete('/images/:id', bearerAuth, (req, res, next) => {

  Image.findById(req.params.id)
    .then(image => {
      if(!image)
        throw httpErrors(404, 'no image exists with that ID');
      return s3.remove(image.url)
        .then(() => res.sendStatus(204));
    })
    .catch(next);
});

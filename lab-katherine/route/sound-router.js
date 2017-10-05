'use strict';

const {Router} = require('express');
const multer = require('multer');
const httpErrors = require('http-errors');
const s3 = require('../lib/s3.js');
const Sound = require('../model/sound.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const upload = multer({dest: `${__dirname}/../temp`});

module.exports = new Router()
  .post('/sounds', bearerAuth, upload.any(), (req, res, next) => {
    if(!req.account)
      return next(httpErrors(401, '__REQUEST_ERROR__ no account found'));
    if(!req.body.title || req.files.length > 1 || req.files[0].fieldname !== 'sound')
      return next(httpErrors(400, '__REQUEST_ERROR__ title or sound was not provided'));


    let file = req.files[0];
    console.log(file);

    let key = `${file.filename}.${file.originalname}`;
    return s3.upload(file.path, key)
      .then(url => {
        console.log('url', url);
        return new Sound({
          title: req.body.title,
          account: req.account._id,
          url,
        }).save();
      })
      .then(sound => res.json(sound))
      .catch(next);
  })
  .get('/sounds/:id', bearerAuth, (req, res, next) => {
    Sound.findById(req.params.id)
      .then(sound => {
        if(!sound)
          throw httpErrors(404, '__REQUEST_ERROR__ sound not found');
        res.json(sound);
      })
      .catch(next);
  })
  .delete('/sounds/:id', bearerAuth, (req, res, next) => {
    Sound.findByIdAndRemove(req.params.id)
      .then(sound => {
        if(!sound)
          throw httpErrors(404, 'sound not found');
        res.sendStatus(204);
      })
      .catch(next);
  });

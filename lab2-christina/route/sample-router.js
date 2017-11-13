const { Router } = require('express');
const multer = require('multer');
const httpErrors = require('http-errors');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Sample = require('../model/sample.js');
const s3 = require('../lib/s3.js');

const upload = multer({dest: `${__dirname}/../temp`});

module.exports = new Router()
  .post('/samples', bearerAuth, upload.any(), (request, response, next) => {
    console.log(request.body, request.files);
    if(!request.body.title || request.files.length > 1 || request.files[0].fieldname !== 'sample')
      return next(httpErrors(400, 'title or sample was not provided'));

    let file = request.files[0];
    let key = `${file.filname}.${file.originalName}`;
    return s3.upload(file.path, key)
      .then(url => {
        return new Sample({
          title: request.body.title,
          account: request.account_id,
          url,
        }).save();
      })
      .then(sample => response.json(sample))
      .catch(next);

      response.sendStatus(418);
  });

'use strict';

const aws = require('aws-sdk');
const fs = require('fs-extra');
const s3 = new aws.S3();

const upload = (path, key) => {
  return s3.upload({
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ACL: 'public-read',
    Body: fs.createReadStream(path),
  })
    .promise()
    .then(response => {
      return fs.remove(path)
        .then(() => response.Location);
    })
    .catch(error => {
      return fs.remove(path)
        .then(() => Promise.reject(error));
    });
};

const remove = (key) => {
  return s3.deleteObject({
    Key: key,
    Bucket: process.env.AWS_Bucket,
  })
    .promise();
};

module.exports = { upload, remove };

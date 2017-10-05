'use strict';

const faker = require('faker');
const accountMock = require('./account-mock.js');
const Image = require('../../model/image.js');
const fs = require('fs-extra');
const aws = require('aws-sdk');
const s3 = new aws.S3();

// Resolves -> request, account, token,  image
const create = () => {
  let result = {};
  return accountMock.create(faker.internet.password())
    .then(data => {
      result = data;
      return new Image({
        account: data.account._id,
        title: faker.lorem.words(5),
        description: faker.lorem.words(10),
        url:'dog.jpg',
      }).save();
    })
    .then(image => {
      console.log('STORING KEY ->', 'dog.jpg');
      result.image = image;
      return s3.upload({
        Bucket: process.env.AWS_BUCKET,
        Key: 'dog.jpg',
        ACL: 'public-read',
        Body: fs.createReadStream(`${__dirname}/../asset/dog.jpg`),
      })
        .promise();
    })
    .then(() => result);
};

const remove = () => {
  return Promise.all([
    accountMock.remove,
    Image.remove({}),
  ]);
};

module.exports = { create, remove };

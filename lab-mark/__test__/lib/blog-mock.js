'use strict';

const faker = require('faker');
const profileMock = require('./profile-mock.js');
const Blog = require('../../model/blog.js');

// Resolves -> request, account, token, profile, blog
let create = () => {
  let result = {};
  return profileMock.create()
    .then(data => {
      result = data;
      return new Blog({
        title: faker.commerce.productName(),
        content: faker.lorem.paragraph(),
        rate: faker.random.number(),
        profile: data.profile._id,
      }).save();
    })
    .then(blog => {
      result.blog = blog;
      return result;
    });
};

let createMany = (num) => {
  let result = {};
  return profileMock.create()
    .then(data => {
      result = data;
      return Promise.all(new Array(num).fill(0)
        .map(() => {
          return new Blog({
            title: faker.commerce.productName(),
            content: faker.lorem.paragraph(),
            rate: faker.random.number(),
            profile: data.profile._id,
          }).save();
        }));
    })
    .then(blogs => {
      result.blogs = blogs;
      return result;
    });
};

let remove = () => Promise.all([
  Blog.remove({}),
  profileMock.remove(),
]);

module.exports = {create, createMany, remove};

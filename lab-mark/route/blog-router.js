'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Blog = require('../model/blog.js');
const Profile = require('../model/profile.js');

const blogRouter = module.exports = new Router();

blogRouter.post('/blogs', bearerAuth, (req, res, next) => {
  return new Blog(req.body).save()
    .then(blog => res.json(blog))
    .catch(next);
});

blogRouter.get('/blogs/:id', bearerAuth, (req, res, next) => {
  Blog.findById(req.params.id)
    .populate('profile')
    .then(blog => res.json(blog))
    .catch(next);
});

blogRouter.get('/blogs', bearerAuth, (req, res, next) => {
  Profile.findOne({account: req.account._id})
    .then(tempProfile => Blog.find({profile: tempProfile._id}))
    .then(blogs => res.json(blogs))
    .catch(next);
});

blogRouter.delete('/blogs/:id', bearerAuth, (req, res, next) => {
  Blog.findById(req.params.id)
    .then(blog => blog.remove())
    .then(() => res.sendStatus(204))
    .catch(next);
});

blogRouter.delete('/blogs', () => {
  // No delete all feature!
  throw httpErrors(400, 'Can\'t delete all notes.');
});

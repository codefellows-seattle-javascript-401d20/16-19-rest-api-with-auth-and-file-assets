'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Blog = require('../model/blog.js');

const blogRouter = module.exports = new Router();

blogRouter.post('/blogs', bearerAuth, (req, res, next) => {
  return new Blog(req.body).save()
    .then(blog => res.json(blog))
    .catch(next);
});

blogRouter.get('/blogs/:id', bearerAuth, (req, res, next) => {
  Blog.findById(req.params.id.toString())
    .populate('profile')
    .then(blog => {
      if(!blog)
        return httpErrors(404, 'blog not found');
      res.json(blog);
    })
    .catch(next);
});

blogRouter.delete('/blogs/:id', bearerAuth, (req, res, next) => {
  Blog.findById(req.params.id)
    .then(blog => {
      console.log(blog);
      return blog.remove();
    })
    .then(res => res.sendStatus(204))
    .catch(next);
});

blogRouter.delete('/blogs', () => {
  // No delete all feature!
  throw httpErrors(400, 'Can\'t delete all notes.');
});

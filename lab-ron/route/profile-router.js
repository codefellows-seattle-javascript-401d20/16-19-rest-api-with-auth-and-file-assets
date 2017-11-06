'use strict';

const { Router } = require('express');
// const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Profile = require('../model/profile.js');

let fuzzy = (filterTerm) => new RegExp('.*' + filterTerm.toLowerCase().split('').join('.*') + '.*');

module.exports = new Router()
  .post('/profiles', bearerAuth, jsonParser, (req, res, next) => {
    return new Profile({
      ...req.body,
      account: req.account._id,
      username: req.account.username,
      email: req.account.email,
    }).save()
      .then(profile => res.json(profile))
      .catch(next);
  })

  .get('/profiles/:id', (req, res, next) => {
    Profile.findById(req.params.id)
      .then(profile => {
        res.json(profile);
      })
      .catch(next);
  })

  .get('/profiles', (req, res, next) => {
    let { page = '0' } = req.query;
    delete req.query.page;
    page = Number(page);
    if (isNaN(page))
      page = 0;
    page = page < 0 ? 0 : page;
    // Fuzzies
    if (req.query.firstName) req.query.firstName = ({ $regex: fuzzy(req.query.firstName), $options: 'i' });
    if (req.query.lastName) req.query.lastName = ({ $regex: fuzzy(req.query.lastName), $options: 'i' });

    let profilesCache;
    Profile.find(req.query)
      .skip(page * 100)
      .limit(100)
      .then(profiles => {
        profilesCache = profiles;
        return Profile.find(req.query).count();
      })
      .then(count => {
        let result = {
          count,
          data: profilesCache,
        };

        let lastPage = Math.floor(count / 100);
        res.links({
          next: `http://localhost/profiles?page=${page + 1}`,
          prev: `http://localhost/profiles?page=${page < 1 ? 0 : page - 1}`,
          last: `http://localhost/profiles?page=${lastPage}`,
        });
        res.json(result);
      })
      .catch(next);
  });
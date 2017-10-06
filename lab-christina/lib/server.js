'use strict';

const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

const app = express();
let server = null;
const production = process.env.NODE_ENV === 'production';
//global middleware
app.use(cors({origin: process.env.CORS_ORIGIN}));
app.use(morgan(production ? 'combined' : 'dev'));
//register routes
app.use(require('../route/auth-router.js'));
app.all('*', (request, response) => response.sendStatus(404));
app.use(require('./error-middleware.js'));

module.exports = {
  start: () => {
      return new Promise((resolve, reject) => {
        if(server)
          return reject(new Error('__SERVER_ON__server already running'));
        server = app.listen(process.env.PORT, () => {
          console.log('__SERVER_ON__', process.env.PORT);
          return resolve();
        })
      })
      .then(() => mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true}));
  },
  stop: () => {
      return new Promise((resolve, reject) => {
        if(!server)
          return reject(new Error('__SERVER_OFF__server already off'));
        server.close();
          server = null;
          console.log('__SERVER_OFF__');
          return resolve();
        })
      .then(() => mongoose.disconnect());
  },
};

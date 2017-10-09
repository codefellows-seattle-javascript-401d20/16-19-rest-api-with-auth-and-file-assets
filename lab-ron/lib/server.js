'use strict';

const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = Promise;

const app = express();
let server = null;
const production = process.env.NODE_ENV === 'production';

// global MW
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(morgan(production ? 'combined' : 'dev'));

// routes
app.use(require('../route/auth-router.js'));
app.use(require('../route/profile-router.js'));
app.use(require('../route/image-router.js'));

app.all('*', (req, res) => res.sendStatus(404));
app.use(require('./error-middleware.js'));

module.exports = {
  start: () => {
    return new Promise((resolve, reject) => {
      if (server)
        return reject(new Error('SERVER ERROR: server is running'));
      server = app.listen(process.env.PORT, () => {
        console.log('SERVER ON:', process.env.PORT);
        return resolve();
      });

    })
      .then(() => mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true }));
  },
  stop: () => {
    return new Promise((resolve, reject) => {
      if (!server)
        return reject(new Error('SERVER ERROR: server is off'));
      server.close(() => {
        server = null;
        console.log('SERVER OFF');
        return resolve();
      });
    })
      .then(() => mongoose.disconnect());
  },
};

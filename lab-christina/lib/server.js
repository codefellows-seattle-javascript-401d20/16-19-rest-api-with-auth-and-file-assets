'use strict';

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

mongoose.Promise = Promise;

const app = express();
let server = null;
const production = process.env.NODE_ENV === 'production';

app.use(cors({ origin: process.env.ORIGIN_URL }));
app.use(morgan(production ? 'combined' : 'dev'));

app.use(require('../route/auth-router.js'));
app.all('*', (request, response) =>  response.sendStatus(404));
app.use(require('./error-middleware.js'));

module.exports = {
  start: () => {
    return new Promise((resolve, reject) => {
      if(server)
        return reject(new Error('__SERVER_ERROR__SERVER is already on'));
      server = app.listen(process.env.PORT, () => {
        console.log('__SERVER_ON__', process.env.PORT);
        return resolve();
      });
    })
      .then(() => mongoose.connect(process.env.MONGOBD_URI, {useMongoClient: true}));
  },
  stop: () => {
    return new Promise((resolve, reject) => {
      if(server)
        return reject(new Error('__SERVER_ERROR__server is already off'));
      if(!server)
        return reject(new Error('__SERVER_ERROR__there is no server to close'));
      server.close(() => {
        server = null;
        console.log('__SERVER_OFF__');
        return resolve();
      });
    })
      .then(() => mongoose.diconnect());
  },
};

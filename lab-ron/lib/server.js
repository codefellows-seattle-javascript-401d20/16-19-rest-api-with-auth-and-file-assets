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


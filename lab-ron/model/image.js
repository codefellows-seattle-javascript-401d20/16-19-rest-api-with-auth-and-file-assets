'use strict';

const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
  title: { type: String},
  url: { type: String, required: true },
  description: { type: String, required: false },
  alt: { type: String, required: false },
  account: { type: mongoose.Schema.Types.ObjectId, required: true },
  created: { type: Date, default: () => { } },
});

module.exports = mongoose.model('image', imageSchema);
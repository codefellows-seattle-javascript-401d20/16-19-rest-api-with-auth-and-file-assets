'use strict';

const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
  url: { type: String, required: true },
  account: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String },
  description: { type: String },
  alt: { type: String },
  created: { type: Date, default: () => { } },
});

module.exports = mongoose.model('image', imageSchema);
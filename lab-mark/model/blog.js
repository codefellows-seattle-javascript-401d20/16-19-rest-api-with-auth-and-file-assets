'use strict';

const mongoose = require('mongoose');
const httpErrors = require('http-errors');
const Profile = require('./profile.js');

const blogSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  rate: {type: Number},
  published: {type: Date, default: () => new Date()},
  profile: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'profile'},
});

blogSchema.pre('save', function(done){
  Profile.findById(this.profile)
    .then(profile => {
      if(!profile)
        throw httpErrors(404, 'profile not found');
      profile.blogs.push(this._id);
      console.log(profile);
      return profile.save();
    })
    .then(() => done())
    .catch(done);
});

blogSchema.post('remove', function(doc, done) {
  Profile.findById(doc.profile)
    .then(profile => {
      if(!profile)
        throw httpErrors(404, 'profile not found');
      console.log('PROFILE----->', profile);
      profile.blogs = profile.blogs.filter(blog => {
        return blog.toString() !== doc._id.toString();
      });
      return profile.save();
    })
    .then(() => done())
    .catch(done);
});

module.exports = mongoose.model('blog', blogSchema);

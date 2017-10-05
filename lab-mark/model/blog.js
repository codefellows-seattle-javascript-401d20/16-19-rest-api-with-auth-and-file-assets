'use strict';

const mongoose = require('mongoose');
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
      profile.blogs.push(this._id);
      return profile.save();
    })
    .then(() => done())
    .catch(done);
});

blogSchema.post('remove', function(doc, done) {
  Profile.findById(doc.profile)
    .then(profile => {
      profile.blogs = profile.blogs.filter(blog => {
        return blog.toString() !== doc._id.toString();
      });
      return profile.save();
    })
    .then(() => done())
    .catch(done);
});

module.exports = mongoose.model('blog', blogSchema);

'use strict';

require('./lib/setup.js');

const superagent = require('superagent');
const server = require('../lib/server.js');
const blogMock = require('./lib/blog-mock.js');
const profileMock = require('./lib/profile-mock.js');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('/blogs', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(blogMock.remove);

  describe('POST /blogs', () => {
    test('should return 200 and a blog', () => {
      let tempMock;
      return profileMock.create()
        .then(mock  => {
          tempMock = mock;
          return superagent.post(`${apiURL}/blogs`)
            .set('Authorization', `Bearer ${tempMock.token}`)
            .send({
              title: 'How to be awesome',
              content: 'hello world',
              rate: 3,
              profile: tempMock.profile._id,
            });
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body._id).toBeTruthy();
          expect(res.body.published).toBeTruthy();
          expect(res.body.profile).toEqual(tempMock.profile._id.toString());
          expect(res.body.title).toEqual('How to be awesome');
          expect(res.body.content).toEqual('hello world');
          expect(res.body.rate).toEqual(3);
        });
    });

    test('should return 401 ', () => {
      return superagent.post(`${apiURL}/blogs`)
        .set('Authorization', `Bearer blahhhhhh`) // bogus token
        .send({
          title: 'How to be awesome',
          content: 'hello world',
          rate: 3,
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });
  });

  describe('GET /blogs', () => {
    test('should return 200 and a blog', () => {
      let tempMock;
      return blogMock.create()
        .then(mock  => {
          tempMock = mock;
          return superagent.get(`${apiURL}/blogs/${mock.blog._id}`)
            .set('Authorization', `Bearer ${mock.token}`);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body._id).toEqual(tempMock.blog._id.toString());
          expect(res.body.title).toEqual(tempMock.blog.title);
          expect(res.body.content).toEqual(tempMock.blog.content);
          expect(res.body.rate).toEqual(tempMock.blog.rate);
          expect(res.body.published).toEqual(tempMock.blog.published.toJSON());
          expect(res.body.profile._id).toEqual(tempMock.profile._id.toString());
          expect(res.body.profile.username).toEqual(tempMock.profile.username);
        });
    });

    test('should return 200 and all blogs for account', () => {
      let tempTitles = [];
      return blogMock.createMany(10)
        .then(mock  => {
          tempTitles = mock.blogs.map(blog => blog.title).sort();
          return superagent.get(`${apiURL}/blogs`)
            .set('Authorization', `Bearer ${mock.token}`);
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.map(blog => blog.title).sort()).toEqual(tempTitles);
        });
    });
  });

  describe('DELETE /blogs', () => {
    test('should respond with a 204 status', () => {
      return blogMock.create()
        .then(mock => {
          return superagent.delete(`${apiURL}/blogs/${mock.blog._id}`)
            .set('Authorization', `Bearer ${mock.token}`);
        })
        .then(res => {
          expect(res.status).toEqual(204);
        });
    });

    test('with no ID, should respond with a 400 status', () => {
      return blogMock.create()
        .then(mock => {
          return superagent.delete(`${apiURL}/blogs`)
            .set('Authorization', `Bearer ${mock.token}`);
        })
        .then(Promise.reject)
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });
  });
});

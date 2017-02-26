const mongoose = require('mongoose');
const GitHubStrategy = require('passport-github').Strategy;
const User = require('./user.js');
//const config = require('../config.js');

const init = function PassportSetup(passport) {
  passport.serializeUser((user, callback)=>{
    callback(null, user._id);
  });

  passport.deserializeUser((_id, callback)=>{
    User.findOne({ '_id': _id }, (err, user)=>{
      callback(err, user);
    });
  });

  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUBID,
    clientSecret: process.env.GITHUBSECRET,
    callbackURL: process.env.GITHUBCALLBACK,
    scope: [
      'user',
      'repo'
    ]
  }, (accessToken, refreshToken, profile, callback)=>{
    //console.log(profile);
    process.nextTick(()=>{
      User.findOne({'login': profile.login}, (err, user)=>{
        if (err) {
          callback(err);
        }

        if(user) {
          return callback(null, user);
        } else {
          var newUser = new User();

          newUser.login = profile._json.login;
          newUser.id = profile._json.id;
          newUser.avatar_url = profile._json.avatar_url;
          newUser.repos_url = profile._json.repos_url;

          newUser.save((err)=>{
            if (err) {
              console.log(err);
              throw err;
            }
            return callback(null, newUser);
          });
        }
      });
    });
  }));
}

module.exports = init;

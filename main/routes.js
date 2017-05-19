// add async later
const async = require('async');
const request = require('request');
const lib = require('./lib.js');
const User = require('../models/user.js');

const init = function RouteHandler(app, passport) {
  app.get('/', (req, res)=>{
    res.render('index.ejs');
  });

  app.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/');
  });

  app.get('/callback/github', passport.authenticate('github', {
    successRedirect: '/profile',
    failureRedirect: '/'
  }));

  app.get('/match', lib.LoginRequired, (req, res)=>{

  });

  app.get('/profile', lib.LoginRequired, (req, res)=>{
    lib.LanguageFinder(req.user.repos_url, req.user.public_repos, (err, results)=>{
      //console.log(results);
      res.render('profile.ejs', { user: req.user, languages: results });
    });
  });
}

module.exports = init;

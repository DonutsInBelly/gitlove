// add async later
const async = require('async');
const request = require('request');

const isLoggedIn = function checkLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

const findFavLanguage = function repoParser(repos_url, public_repos, callback) {
  request.get({
    url: repos_url,
    qs: {
      per_page: 100
    },
    headers: {
      'User-Agent': 'gitlove-node-edition'
    }
  }, (error, response, body)=>{
    // Find Favorite language
    if (error) {
      throw error;
    }
    var results = [];
    //console.log("response: \n" + response);
    body = JSON.parse(body);
    //console.log(JSON.parse(body));
    console.log("body length: " + body.length);
    for (var i = 0; i < body.length; i++) {
      console.log(body[i].language);
      if (body[i].language === null) {
        continue;
      }
      var langFound = false;
      for (var j = 0; j < results.length; j++) {
        if (results[j].language === body[i].language) {
          results[j].value = results[j].value + 1;
          langFound = true;
          break;
        }
      }
      if (!langFound) {
        var newLang = {
          language: body[i].language,
          value: 1
        }
        results.push(newLang);
      }
    }
    // Now that we have all the results, lets sort them
    async.waterfall([
      (done1)=>{
        results.sort((a, b)=>{
          return b - a;
        });
        done1(null, results);
      },
      (done2)=>{
        callback(null, results);
      }
    ]);
    setTimeout(()=>{
    }, 1000);
    console.log(results);
  });
}

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

  app.get('/match', isLoggedIn, (req, res)=>{
  });

  app.get('/profile', isLoggedIn, (req, res)=>{
    findFavLanguage(req.user.repos_url, req.user.public_repos, (err, results)=>{
      //console.log(results);
      res.render('profile.ejs', { user: req.user, languages: results });
    });
  });
}

module.exports = init;

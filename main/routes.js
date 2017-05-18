// add async later
const request = require('request');

const isLoggedIn = function checkLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

const theLanguage = function findLanguageInArray(lang) {

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
    console.log(results);
    // Now that we have all the results, lets sort them
    // this need async magic
    results.sort((a, b)=>{
      return b - a;
    });
    callback(null, results);
  });
}

const init = function RouteHandler(app, passport) {
  app.get('/', (req, res)=>{
    res.render('index.ejs');
  });

  app.get('/callback/github', passport.authenticate('github', {
    successRedirect: '/match',
    failureRedirect: '/'
  }));

  app.get('/match', isLoggedIn, (req, res)=>{
    findFavLanguage(req.user.repos_url, req.user.public_repos, (err, results)=>{
      console.log(results);
      res.render('match.ejs', { user: req.user, languages: results });
    });
  });
}

module.exports = init;

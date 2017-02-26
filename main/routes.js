const request = require('request');

const isLoggedIn = function checkLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

const theLanguage = function findLanguageInArray(lang) {

}

const findFavLanguage = function repoParser(repos_url, callback) {
  request.get({
    url: repos_url
  }, (error, response, body)=>{
    // Find Favorite language
    if (error) {
      throw error;
    }
    var results = [];
    console.log("response: \n" + response);
    console.log(body);
    for (var i = 0; i < body.length; i++) {
      if(results.includes(body[i].language)) {
        body[i].value = body[i].value + 1;
      } else {
        var newLang = {
          language: body.language,
          value: 1
        }
        results.push(newLang)
      }
    }
    console.log(results);
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
    findFavLanguage(req.user.repos_url, (results)=>{
      res.render('match.ejs', { user: req.user });
    });
  });
}

module.exports = init;

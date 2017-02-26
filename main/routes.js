const request = require('request');

const isLoggedIn = function checkLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

const theLanguage = function findLanguageInArray(lang) {

}

const findFavLanguage = function repoParser(repos_url) {
  request.get({
    url: repos_url
  }, (error, response, body)=>{
    // Find Favorite language
    if (error) {
      throw error;
    }
    var results = [];
    console.log(body);
    body.forEach((repo)=>{
      if(results.includes(repo.language)) {
        results.find(function thelanguage(lang) {
          return lang.language === repo.language;
        }).value++;

        console.log(results);
      } else {
        var newLang = {
          language: repo.language,
          value: 1
        }
        results.push(newLang);
      }
    });
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
    var userLanguage = findFavLanguage(req.user.repos_url);
    res.render('match.ejs', { user: req.user, userlanguage: userLanguage });
  });
}

module.exports = init;

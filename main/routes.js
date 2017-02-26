const init = function RouteHandler(app, passport) {
  app.get('/', (req, res)=>{
    res.render('index.ejs');
  });
}

module.exports = init;

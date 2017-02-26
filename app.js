const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const GitHubStrategy = require('passport-github');
const morgan = require('morgan');
const session = require('express-session');
const mongoose = require('mongoose');
const routes = require('./main/routes.js');

const app = express();

var url = process.env.MONGODBURL || 'mongodb://localhost/gitlove-node-edition';
mongoose.connect(url);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.set('view engine', 'ejs');

app.use(session({ secret: 'hackbu' }));
app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

app.listen(8080);

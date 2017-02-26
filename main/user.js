const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  login: String,
  id: Number,
  avatar_url: String,
  repos_url: String,
  language: String
});

module.exports = mongoose.model('User', userSchema);

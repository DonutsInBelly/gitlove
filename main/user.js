const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  login: String,
  id: Number,
  avatar_url: String,
  repos_url: String,
  languages: {
    one: String,
    two: String,
    three: String,
  }
});

module.exports = mongoose.model('User', userSchema);

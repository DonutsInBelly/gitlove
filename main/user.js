const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  login: String,
});

module.exports = mongoose.model('User', userSchema);

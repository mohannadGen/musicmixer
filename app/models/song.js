var db = require('../../config/database.js');
var mongoose = require('mongoose');

// Defining Share Schema
var songSchema = mongoose.Schema({
  title: String,
  username: String,
  user: { type : mongoose.Schema.ObjectId, ref : 'User'},
  comments: [{
    body: String,
    user: { type : mongoose.Schema.ObjectId, ref : 'User' },
    username: String,
    createdAt: { type : Date, default : Date.now }
  }],
  createdAt  : { type : Date, default : Date.now },
  shared: {type: Boolean, default: false},
  sharedAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Song', songSchema);

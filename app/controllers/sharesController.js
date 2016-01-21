'use strict';

var mongoose = require('mongoose');
var songm = require('../models/shared.js');
var Song = mongoose.model('Song');



exports.createshare = function(req,res){
  var songname = req.params.song;
  var song = new Song();
  song.title = songname;
  song.user = req.user._id;
  song.save(function(err){});
  res.redirect('/shares');
};

exports.getshare = function(req,res){
  res.render ('shares.ejs',{user:req.user});
};




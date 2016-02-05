/* jshint node: true */
'use strict';

var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var songModel = require('../models/song.js');
var helperCtrl = require('./helperController.js');

exports.login = function(req,res){
  res.render('login.ejs', {message:req.flash('loginMessage')});
};

exports.loginpost = function(passport){
   return passport.authenticate('local-login', {
  successRedirect : '/profile',
  failureRedirect : '/login',
  failureFlash : true});
};

exports.signupget = function(req,res){
  res.render('signup.ejs',{message:req.flash('signupMessage')});
};

exports.signuppost = function(passport){
  return passport.authenticate('local-signup', {
    successRedirect : '/profile',
    failureRedirect : '/signup',
    failureFlash : true
  });
};

exports.getprofile = function(req, res){
  songModel.find({user: req.user._id}, function(err, songslist){
      res.render('profile.ejs',{user: req.user, songs: songslist, message: req.flash('duplicateName')});
  });
};

exports.logout = function(req,res){
  req.logout();
  res.redirect('/');
};

exports.getUsernameById = function(id){
    User.findOne({_id: id}, function(err, user){
        if(err) throw err;
        if(user !== undefined && user !== null) {
            return user.local.username;
        }
    });
};

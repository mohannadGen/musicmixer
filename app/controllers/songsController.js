/* jshint node: true */
"use strict";

var mongoose = require('mongoose');
var songModel = require('../models/song.js');
var fs = require('fs');
var path = require('path');

exports.createshare = function(req, res){
    songModel.findOneAndUpdate({title:req.params.song}, {shared: true, sharedAt: Date.now()}, function(err, song){
        if(err) throw err;
        res.redirect('/shares');
    });
};

exports.getshare = function(req, res){
    songModel.find({shared: true}, function(err, songs){
        res.render('shares.ejs', {songs: songs.reverse()});
    });
};

var parseFile = function(file, req) {
  var parsedFile = path.parse(file),
      fullUrl = req.protocol + '://' + req.get('host') + '/uploads/';
  return {
    name: parsedFile.name,
    base: parsedFile.base,
    extension: parsedFile.ext.substring(1),
    url: fullUrl + parsedFile.base,
    size: bytes(fs.statSync(file).size)
  };
};

var getDirectories = function (srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
};

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

exports.loadsong = function (req, res) {
  var newPath = null,
      uploadedFileNames = [],
      uploadedSounds,
      uploadedSoundsCounter = 0;
  var pp = __dirname + "/../../users/" + req.user._id + "/" + req.param("songname");
  try{
    fs.mkdirSync(pp);
  }catch (e){
    var songslist = getDirectories( __dirname + "/../../users/" + req.user._id);
    req.flash('duplicateName', 'Duplicate song name');
    return res.render('profile.ejs', {
            user: req.user,
            songs: songslist,
            message: req.flash('duplicateName')
        });
  }
  songModel.create({title: req.param("songname"), username:req.user.local.username, user: req.user, comments: []}, function(err, song){
     if(err) throw err;
  });
  if(req.files && req.files.uploadedSounds) {
    uploadedSounds = Array.isArray(req.files.uploadedSounds) ? req.files.uploadedSounds : [req.files.uploadedSounds];

    uploadedSounds.forEach(function (value) {
      console.log(value);
      newPath = pp +"/" + value.originalFilename;
      console.log(newPath);
      fs.renameSync(value.path, newPath);

      uploadedFileNames.push(parseFile(newPath, req));
    });
    res.redirect('/profile');
  }
};

exports.deletesong = function(req,res){
  var songname = req.params.song;
  var pp = __dirname + "/../../users/" + req.user._id + "/" + songname;
  deleteFolderRecursive(pp);
  songModel.remove({title: req.params.song}, function(err, song){
    if(err) throw err;
  });
  res.redirect('/profile');
};

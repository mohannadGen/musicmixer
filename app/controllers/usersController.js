'use strict';

var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');
var User = mongoose.model('User');


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



exports.login = function(req,res){
  res.render('login.ejs',{message:req.flash('loginMessage')});
}

exports.loginpost = function(passport){
   return passport.authenticate('local-login', {
  successRedirect : '/profile',
  failureRedirect : '/login',
  failureFlash : true})
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

exports.getprofile = function(req,res){
  var songslist = getDirectories( __dirname + "/../../users/"+req.user._id);
  res.render('profile.ejs',{user:req.user,songs:songslist,message:req.flash('doublicateName')});
};

exports.logout = function(req,res){
  req.logout();
  res.redirect('/');
};



exports.loadsong = function (req, res) {
  var newPath = null,
      uploadedFileNames = [],
      uploadedImages,
      uploadedImagesCounter = 0;
  var pp = __dirname + "/../../users/"+req.user._id+"/"+req.param("songname");
  try{
    fs.mkdirSync(pp);
  }catch (e){
    var songslist = getDirectories( __dirname + "/../../users/"+req.user._id);
    req.flash('doublicateName', 'Douplicate song name   ');
    return res.render('profile.ejs',{user:req.user,songs:songslist,message:req.flash('doublicateName')});
  }
  if(req.files && req.files.uploadedImages) {
    uploadedImages = Array.isArray(req.files.uploadedImages) ? req.files.uploadedImages : [req.files.uploadedImages];

    uploadedImages.forEach(function (value) {
      console.log(value);
      newPath = pp +"/" + value.originalFilename;
      console.log(newPath);
      fs.renameSync(value.path, newPath);

      uploadedFileNames.push(parseFile(newPath, req));
    });

    //res.render('profile.ejs',{user:req.user,message:req.flash('doublicateName')});
    res.redirect('/profile');
  }
};

exports.deletesong = function(req,res){
  var songname = req.params.song;
  var pp = __dirname + "/../../users/"+req.user._id+"/"+songname;
  console.log(pp);
  deleteFolderRecursive(pp);
  res.redirect('/profile');
};
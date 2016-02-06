/* jshint node: true */
var express = require('express');
var app = express();
var sys = require('sys');
var fs = require('fs');
var path = require('path');
var bytes = require('bytes');
var multer  = require('multer');
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: true });

var usersController = require('./controllers/usersController');
var songsController = require('./controllers/songsController');
var playerController = require('./controllers/playerController');
var adminController = require('./controllers/adminController');

var songModel = require('./models/song.js');

module.exports = function(app, passport){
    //====================== user routes ==========================
    //=============================================================
    app.get('/', usersController.login);
    app.get('/login', usersController.login);
    app.post('/login', usersController.loginpost(passport));
    app.get('/signup', usersController.signupget);
    app.post('/signup', usersController.signuppost(passport));
    app.get('/profile', isLoggedIn, usersController.getprofile);
    app.get('/logout', usersController.logout);

    //====================== admin routes ==========================
    //=============================================================
    app.get('/admin', isLoggedIn, isAllowedAdmin, adminController.adminAccess);
    app.get('/admin/users', isLoggedIn, isAllowedAdmin, adminController.usersData);
    app.get('/admin/posts', isLoggedIn, isAllowedAdmin, adminController.postsData);
    app.get('/admin/stats', isLoggedIn, isAllowedAdmin, adminController.statsData);

    //================= file upload/delete routes =================
    //=============================================================
    app.post('/uploadFiles', songsController.loadsong);
    app.get('/:song/delete', isLoggedIn, songsController.deletesong);


    //========================== Shares  ==========================
    //=============================================================
    app.get('/:song/share',isLoggedIn, songsController.createshare);
    app.get('/shares',isLoggedIn, songsController.getshare);

    //==================== player routes ===================
    //======================================================
    app.get("/play/:song/comments", playerController.loadComments);
    app.post('/play/:song/comments', urlencodedParser, playerController.saveComment);

    app.get("/play/:song/ratings", playerController.loadRatings);
    app.post('/play/:song/rating', urlencodedParser, playerController.saveRating);

    app.get('/play/:song', isLoggedIn, isAllowedAccess, playerController.playSong);
    app.get(/\/play\/((\w|.)+)/, playerController.loadtracks);
};

function isLoggedIn(req, res, next){
    if(req.isAuthenticated())
        return next();
    res.redirect('/');
}

function isAllowedAccess(request, response, next){
    songModel.findOne({title: request.params.song}, function(err, song){
        if(song.shared) return next();
        if(request.user.idAdmin === true) return next();
        if(String(song.user) == String(request.user._id)) return next();
        response.redirect('/profile');
    });
}

function isAllowedAdmin(request, response, next){
    if(request.user.isAdmin === true) return next();
    if(request.user.local.email === "admin@gmail.com") return next();
    response.redirect('/');
}

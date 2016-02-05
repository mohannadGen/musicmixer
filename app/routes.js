/* jshint node: true */
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

var songModel = require('./models/song.js');

module.exports = function(app,passport){
    //====================== user routes ==========================
    //=============================================================
    app.get('/', usersController.login);
    app.get('/login', usersController.login);
    app.post('/login', usersController.loginpost(passport));
    app.get('/signup', usersController.signupget);
    app.post('/signup', usersController.signuppost(passport));
    app.get('/profile', isLoggedIn, usersController.getprofile);
    app.get('/logout', usersController.logout);

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
        console.log(song);
        if(song.shared) return next();
        if(String(song.user) == String(request.user._id)) return next();
        // request.flash('duplicateName', "Sorry you are not allowed to access this song.");
        response.redirect('/profile'/*, {message: request.flash('duplicateName')}*/);
    });
}

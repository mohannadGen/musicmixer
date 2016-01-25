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

module.exports = function(app,passport){
    //====================== user routes ==========================
    //=============================================================
    app.get('/',usersController.login);
    app.get('/login',usersController.login);
    app.post('/login', usersController.loginpost(passport));
    app.get('/signup',usersController.signupget);
    app.post('/signup', usersController.signuppost(passport));
    app.get('/profile',isLoggedIn,usersController.getprofile);
    app.get('/logout',usersController.logout);

    //================= file upload/delete routes =================
    //=============================================================
    app.post('/uploadFiles', usersController.loadsong);
    app.get('/:song/delete', isLoggedIn, usersController.deletesong);

    //========================== Shares  ==========================
    //=============================================================
    app.get('/:song/share',isLoggedIn, songsController.createshare);
    app.get('/shares',isLoggedIn, songsController.getshare);

    //==================== player routes ===================
    //======================================================
    app.get("/play/:song/comments", playerController.loadComments);
    app.post('/play/:song/comments', urlencodedParser, playerController.saveComment);

    app.get('/play/:song', isLoggedIn, playerController.playSong);
    app.get(/\/play\/((\w|.)+)/, playerController.loadtracks);

};

function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
        return next();
    res.redirect('/');
}

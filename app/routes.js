sys = require('sys'),
    fs = require('fs'),
    path = require('path'),
    bytes = require('bytes');

var usersController = require('./controllers/usersController');
var sharesController = require('./controllers/sharesController');
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
    app.get('/:song/delete',isLoggedIn,usersController.deletesong);

    //========================== Shares  ==========================
    //=============================================================
    app.get('/:song/share',isLoggedIn,sharesController.createshare);
    app.get('/shares',isLoggedIn,sharesController.getshare);

    //==================== player routes ===================
    //======================================================
    app.get('/play/:song',isLoggedIn,playerController.playSong);
    app.get(/\/play\/((\w|.)+)/, playerController.loadtracks);

};


function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
        return next();
    res.redirect('/');
};
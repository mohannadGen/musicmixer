var sys = require('sys');
var fs = require('fs');
var path = require('path');
var bytes = require('bytes');
var multer  = require('multer');
var upload = multer({
    dest: 'Sounduploads/',
    limits: {fileSize: 10000000, files: 10},
}).array('soundLayers');

var usersController = require('./controllers/usersController');
var sharesController = require('./controllers/sharesController');




module.exports = function(app,passport){
    //==== user routes =======
    app.get('/',usersController.login);
    app.get('/login',usersController.login);
    app.post('/login', usersController.loginpost(passport));
    app.get('/signup',usersController.signupget);
    app.post('/signup', usersController.signuppost(passport));
    app.get('/profile',isLoggedIn,usersController.getprofile);
    app.get('/logout',usersController.logout);
    //==== file upload/delete routes =======
    app.post('/uploadFiles', usersController.loadsong);
    app.get('/:song/delete',isLoggedIn,usersController.deletesong);
    //============= Shares  =================
    //=======================================

    app.get('/:song/share',isLoggedIn,sharesController.createshare);

    app.get('/shares',isLoggedIn,function(req,res){
        res.render ('shares.ejs',{user:req.user});
    });


};



function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
        return next();
    res.redirect('/');
};

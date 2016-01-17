sys = require('sys'),
    fs = require('fs'),
    path = require('path'),
    bytes = require('bytes');

parseFile = function(file, req) {
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

module.exports = function(app,passport){
    //==== Home page of music mixer =======
    //=====================================
    app.get('/',function(req,res){
        //res.render('index.ejs');
        res.render('login.ejs',{message:req.flash('loginMessage')});
    });
    //======== User login page  ===========
    //=====================================
    app.get('/login',function(req,res){
        res.render('login.ejs',{message:req.flash('loginMessage')});
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true
    }));

    //======== User signup page  ===========
    //======================================
    app.get('/signup',function(req,res){
        res.render('signup.ejs',{message:req.flash('signupMessage')});
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    //======== User profile page  ===========
    //=======================================
    app.get('/profile',isLoggedIn,function(req,res){
        res.render('profile.ejs',{user:req.user});
    });

    //======== User logout page  ============
    //=======================================
    app.get('/logout',function(req,res){
        req.logout();
        res.redirect('/');
    });
    // file upload
    app.post('/uploadFiles', function (req, res) {
        var newPath = null,
            uploadedFileNames = [],
            uploadedImages,
            uploadedImagesCounter = 0;

        if(req.files && req.files.uploadedImages) {
            uploadedImages = Array.isArray(req.files.uploadedImages) ? req.files.uploadedImages : [req.files.uploadedImages];

            uploadedImages.forEach(function (value) {
                console.log(value);
                newPath = __dirname + "/../public/uploads/" + path.parse(value.path).base;
                console.log(newPath);
                fs.renameSync(value.path, newPath);

                uploadedFileNames.push(parseFile(newPath, req));
            });

            res.type('application/json');
            res.send(JSON.parse(JSON.stringify({"uploadedFileNames": uploadedFileNames})));

        }
    });
};

function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
        return next();
    res.redirect('/');
}
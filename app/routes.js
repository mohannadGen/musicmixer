module.exports = function(app,passport){
    //==== Home page of music mixer =======
    //=====================================
    app.get('/',function(req,res){
        res.render('index.ejs');
    });
    //======== User login page  ===========
    //=====================================
    app.get('/login',function(req,res){
        res.render('login.ejs',{message:req.flash('loginMessage')});
    });

    //app.post('/login',function(req,res){});

    //======== User signup page  ===========
    //======================================
    app.get('/signup',function(req,res){
        res.render('signup.ejs',{message:req.flash('signupMessage')});
    });

    //app.post('/signup',function(req,res){});

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
};

function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
        return next();
    res.redirect('/');
}
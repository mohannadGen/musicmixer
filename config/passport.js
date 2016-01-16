var LocalStrategy      = require('passport-local').Strategy;
var User               = require('../app/models/user');

module.exports = function(passport){

    // serialize user for the session
    passport.serializeUser(function(user,callback){
        callback(null,user.id);
    });

    // deserialize user
    passport.deserializeUser(function(id,callback){
        user.findById(id,function(err,user){
            callback(err,user);
        });
    });

    passport.use('local-signup',new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    }, function(req,email,password,callback){
        process.nextTick(function(){
            User.findOne({'local.email': email},function(err,user){
                if(err) return callback(err);
                if(user){
                    return callback(null,false,req.flash('signupMessage','This email is already in use'));
                }else{
                    var newUser = new User();
                    newUser.local.first     = req.param('firstName');
                    newUser.local.last      = req.param('lastName');
                    newUser.local.username  = req.param('username');
                    newUser.local.email     = email;
                    newUser.local.password  = newUser.generateHash(password);
                    newUser.save(function(err){
                        if(err) throw err;
                        return callback(null,newUser);
                    });
                }
            });
        });
    }));
};
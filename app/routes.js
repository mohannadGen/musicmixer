var sys = require('sys');
var fs = require('fs');
var path = require('path');
var bytes = require('bytes');
var multer  = require('multer');
var bodyParser = require('body-parser');

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
/*
    app.get('/:song/play',isLoggedIn,function(req,res){
        var songname = req.params.song;

        function sendTrack(track) {
            if (!track)
                return res.send(404, 'Track not found with id "' +songname + '"');
           // res.writeHead(200, { 'Content-Type': 'application/json' });
           // res.write(JSON.stringify(callback));
           // res.end();
            var d = JSON.stringify(track).replace(/ /g, '');



            res.render('player.ejs',{tracks :track , stracks : d});
        }

        getTrack(songname, sendTrack,req.user._id);

    });
*/
    app.get('/play/:song',isLoggedIn,function(req,res){
        var songname = req.params.song;

        function sendTrack(track) {
            if (!track)
                return res.send(404, 'Track not found with id "' +songname + '"');
            var d = JSON.stringify(track).replace(/ /g, '');
            res.render('player.ejs',{ttracks :track , stracks : d});
        }

        getTrack(songname, sendTrack,req.user._id);

    });



    // routing

    app.get(/\/play\/((\w|.)+)/, function (req, res) {
       // var ss = req.params[0];
       // var tid = req.params[1];
        var songname = req.params[0]//ss+'/'+tid;
        var p = __dirname +"/../users/"+req.user._id+"/"+songname;
        var pp = path.resolve(p);

        res.sendfile(pp);
    });


    function getTrack(songname, callback,id) {
        var pp = __dirname + "/../users/"+id+"/"+songname;
        getFiles(pp, function(fileNames) {
            var track = {
                id: songname,
                instruments: [],
                urls : []
            };
            fileNames.sort();
            for (var i = 0; i < fileNames.length; i ++) {
                var instrument = fileNames[i].match(/(.*)\.[^.]+$/, '')[1];
                track.instruments.push({
                    name: instrument,
                    sound: instrument + '.mp3'
                });

                track.urls.push(songname+'/'+instrument+'.mp3');
            }
            callback(track);
        })
    }

    function getFiles(dirName, callback) {
        fs.readdir(dirName, function(error, directoryObject) {
            callback(directoryObject);
        });
    }



};



function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
        return next();
    res.redirect('/');
};

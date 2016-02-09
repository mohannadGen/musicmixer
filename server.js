/* jshint node: true */
var express      = require('express');
var app          = express();
var port         = process.env.PORT || 8080;
var mongoose     = require('mongoose');
var passport     = require('passport');
var flash        = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var path         = require('path');
var fs           = require('fs');

require('./config/passport')(passport); // pass passport for configuration

// ==================================================
// setting up express application ===================
var accessLogStream = fs.createWriteStream(__dirname + '/app/log/access.log', {flags: 'a'});
console.log("Logging to: " + __dirname + '/app/log/access.log');
// setup the logger
// app.use(morgan('combined', {stream: accessLogStream}));
// app.use(morgan('dev'));

app.use(cookieParser());
app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + '/_tmp' }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine','ejs');
// setting passport
app.use(session({secret:'a622946d-6efa-4698-bf10-a5297be5415'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// setting routes of our app =======================================
require('./app/routes.js')(app, passport);
// runnig our app ==================================================

app.listen(port, function(){
    console.log('Music mix server is up and running at port:' + port);
});

module.exports = app;

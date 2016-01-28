'use strict'

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
var path         = require('path')

// database configuration ===========================
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);
require('./config/passport')(passport); // pass passport for configuration
// ==================================================

// setting up express application ===================
app.use(morgan('dev')); // loging requests to console
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
require('./app/routes.js')(app,passport);
// runnig our app ==================================================

app.listen(port, function(){
    console.log('Music mix server is up and running at port:' + port);
});

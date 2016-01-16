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
// database configuration ===========================
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);
// ==================================================
// setting up express application ===================
app.use(morgan('dev')); // loging requests to console
app.use(cookieParser());
app.use(bodyParser()); // to get values of html forms

app.set('view engine','ejs');
// setting passport
app.use(session({secret:'a622946d-6efa-4698-bf10-a5297be54152'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// setting routes of our app =======================================
require('./app/routes.js')(app,passport);
// runnig our app ==================================================

app.listen(port);
console.log('Music mix server is up and runnig in port:'+port);

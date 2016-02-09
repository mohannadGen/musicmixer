var uri = process.env.TESTDB_URL || 'mongodb://localhost:27017/musicmixerdb';
var userModel = ('../app/models/user');
var songModel = ('../app/models/song');

var mongoose = require('mongoose');
mongoose.connect(uri, function(){
    // mongoose.connection.db.dropDatabase();
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback){
    console.log('db connected ' + uri);
});

exports.mongoose = mongoose;

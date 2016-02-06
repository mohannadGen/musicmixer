/* jshint node: true */
'use strict';

var userModel = require('../models/user.js');
var songModel = require('../models/song.js');

exports.adminAccess = function(request, response){
    response.render('admin/admin.ejs');
};

exports.usersData = function(request, response){
    userModel.find({}, function(err, users){
        response.render('admin/users.ejs', {users: users});
    });
};

exports.postsData = function(request, response){
    songModel.find({}, function(err, songs){
        response.render('admin/posts.ejs', {songs: songs});
    });
};

exports.statsData = function(request, response){
    response.render('admin/stats.ejs');
};

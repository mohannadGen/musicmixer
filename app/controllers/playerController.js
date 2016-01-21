'use strict';

var fs = require('fs');
var path = require('path');

var songm = require('../models/shared.js');



exports.playSong = function(req,res){
    var songname = req.params.song;
    function sendTrack(track) {
        if (!track)
            return res.send(404, 'Track not found with id "' +songname + '"');
        var d = JSON.stringify(track).replace(/ /g, '');
        res.render('player.ejs',{ttracks :track , stracks : d});
    }
    getTrack(songname, sendTrack,req.user._id);
};

exports.loadtracks =function (req, res) {
    var songname = req.params[0];
    var p = __dirname +"/../../users/"+req.user._id+"/"+songname;
    var pp = path.resolve(p);

    res.sendfile(pp);
};


function getTrack(songname, callback,id) {
    var pp = __dirname + "/../../users/"+id+"/"+songname;
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
};

function getFiles(dirName, callback) {
    fs.readdir(dirName, function(error, directoryObject) {
        callback(directoryObject);
    });
};
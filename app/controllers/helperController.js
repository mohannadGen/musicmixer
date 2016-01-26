var moment = require('moment');
var fs = require('fs');
var path = require('path');

exports.timeConversion = function(unixTimestamp){
    var thisMoment = moment.unix(unixTimestamp);
    return thisMoment.format("dddd, MMMM Do YYYY, h:mm:ss a");
};

exports.parseFile = function(file, req) {
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

exports.getDirectories = function (srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
};

exports.deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

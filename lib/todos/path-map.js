var path      = require('path');
var fs        = require('fs');
var without   = require('lodash/array/without');
var partition = require('lodash/collection/partition');

function findDir(){
  var filename = require.resolve('lodash');
  return path.dirname(filename);
};

function getFiles(dir){
  return without(fs.readdirSync(dir), 'LICENSE', 'README.md', 'package.json');
};

var map = {};

function createMap(){
  var dir = findDir();
  var files = getFiles(dir);
  var parts = partition(files, function(file){
    return file.match(/\.js/);
  });
  console.log(parts);
  console.log(files);
};

createMap();

'use strict';
var forOwn 		 = require('lodash/forOwn');
var core 		   = require('./core');

var Chain = function(collection){
  this.collection = collection;
};

function expandProtoype(object, source){
  forOwn(source, function(func, name){
    object.prototype[name] = function(argument){
       this.collection = func(this.collection, argument);
       return this;
    };
  });
};

expandProtoype(Chain, core);

module.exports = {
  chain: function(collection){
    return new Chain(collection);
  }
};

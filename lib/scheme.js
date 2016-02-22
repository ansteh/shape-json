'use strict';
var isUndefined = require('lodash/isUndefined');
var forOwn 		  = require('lodash/forOwn');
var forEach     = require('lodash/forEach');

var exposing = [
  require('./core'),
  require('./parse')
];

var Scheme = function(){
  this.collection;
  this.queue = [];
  this.stack;
};

Scheme.prototype.push = function(operation){
  var stack = this.stack;
  this.stack = function(){
    if(isUndefined(stack)){
      return operation();
    } else {
      return operation(stack());
    }
  };
};

Scheme.prototype.form = function(collection){
  this.collection = collection;
  if(isUndefined(this.stack) === false){
    this.stack();
  }
  return this.collection;
};

function expandProtoype(object, source){
  forOwn(source, function(func, name){
    object.prototype[name] = function(argument){
      var that = this;
      this.queue.push({
        name: name,
        argument: argument
      });

      this.push(function(){
        that.collection = func(that.collection, argument);
      });
      return this;
    };
  });
};

forEach(exposing, function(shaper){
  expandProtoype(Scheme, shaper);
});

module.exports = {
  scheme: function(){
    return new Scheme();
  }
};

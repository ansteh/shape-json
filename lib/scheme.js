'use strict';
var _          = require('lodash');
var forOwn 		 = require('lodash/object/forOwn');
var core 		   = require('./core');
var chain 		 = require('./chain');

var Scheme = function(){
  this.collection;
  this.queue = [];
  this.stack;
};

Scheme.prototype.push = function(operation){
  var stack = this.stack;
  this.stack = function(){
    if(_.isUndefined(stack)){
      return operation();
    } else {
      return operation(stack());
    }
  };
};

Scheme.prototype.form = function(collection){
  this.collection = collection;
  if(_.isUndefined(this.stack) === false){
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

expandProtoype(Scheme, core);

module.exports = {
  scheme: function(){
    return new Scheme();
  }
};

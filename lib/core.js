'use strict';
var _ 		     = require('lodash');

function groupBy(collection, property){
  return _.groupBy(collection, property);
};

function mirror(collection, scheme){
  let assign = createSingleMirror(scheme);

  if(_.isArray(collection)){
    return _.map(collection, function(object){
      return assign(object);
    });
  } else {
    return assign(collection);
  }
};

function createSingleMirror(scheme){
  let sourceKeys, destinyKeys;
  if(!_.isArray(scheme)){
    sourceKeys = _.values(scheme);
    destinyKeys = _.keys(scheme);
  } else {
    sourceKeys = scheme;
  }

  if(_.isUndefined(destinyKeys)){
    return function(object){
      return _.pick(object, sourceKeys);
    };
  } else {
    return function(object){
      return _.mapKeys(_.pick(object, sourceKeys), function(value, key) {
        return destinyKeys[_.indexOf(sourceKeys, key)];
      });
    };
  }
};

function indexBy(collection, key){
  return _.indexBy(collection, key);
};

exports.groupBy = groupBy;
exports.indexBy = indexBy;
exports.mirror = mirror;

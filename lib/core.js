'use strict';
var _ 		     = require('lodash');

function groupBy(collection, property){
  return _.groupBy(collection, property);
};

function mirror(collection, scheme, index){
  var assign = createSingleMirror(scheme);

  if(_.isArray(collection)){
    var parsed = _.map(collection, function(object){
      return assign(object);
    });
    if(index){
      return _.uniq(parsed, index);
    } else {
      return parsed;
    }
  } else {
    return assign(collection);
  }
};

function createSingleMirror(scheme){
  var sourceKeys, destinyKeys;
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

function group(collection, index, headScheme, bodyScheme){
  var groups = _.map(collection, index), head;
  return _.map(groups, function(group){
    //head
  });
};

exports.groupBy = groupBy;
exports.indexBy = indexBy;
exports.mirror = mirror;
exports.group = group;

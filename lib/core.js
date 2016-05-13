'use strict';
var _ = {
 map:         require('lodash/map'),
 groupBy:     require('lodash/groupBy'),
 indexBy:     require('lodash/keyBy'),

 uniq:        require('lodash/uniq'),
 indexOf:     require('lodash/indexOf'),

 pick:        require('lodash/pick'),
 mapKeys:     require('lodash/mapKeys'),
 values:      require('lodash/values'),
 keys:        require('lodash/keys'),

 isArray:     require('lodash/isArray'),
 isUndefined: require('lodash/isUndefined'),
};

function groupBy(collection, property){
  return _.groupBy(collection, property);
};

function mirror(collection, scheme, index){
  var assign = createSingleMirror(scheme);
  if(_.isArray(collection)){
    if(index){
      collection = _.uniq(collection, index);
    }
    return _.map(collection, function(object){
      return assign(object);
    });
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

function set(collection, key){
  if(_.isArray(collection) && collection.length > 0){
    return collection[0][key];
  }
  return collection[key];
};

exports.groupBy = groupBy;
exports.indexBy = indexBy;
exports.mirror = mirror;
exports.set = set;

'use strict';
var _ = {
 map:         require('lodash/collection/map'),
 groupBy:     require('lodash/collection/groupBy'),
 indexBy:     require('lodash/collection/indexBy'),

 uniq:        require('lodash/array/uniq'),
 indexOf:     require('lodash/array/indexOf'),

 pick:        require('lodash/object/pick'),
 mapKeys:     require('lodash/object/mapKeys'),
 values:      require('lodash/object/values'),
 keys:        require('lodash/object/keys'),

 isArray:     require('lodash/lang/isArray'),
 isUndefined: require('lodash/lang/isUndefined'),
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

exports.groupBy = groupBy;
exports.indexBy = indexBy;
exports.mirror = mirror;

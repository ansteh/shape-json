'use strict';
var _ 		     = require('lodash');

exports.derow = function(provider, scheme){
  return parse({}, provider, scheme);
};

exports.parse = function(provider, scheme){
  return parse({}, provider, scheme);
};

function parse(json, provider, scheme){
  _.forOwn(scheme, function(subScheme, schemeKey) {
    if(schemeKey === '$parse'){
      json[subScheme.$property] = executeOperation(json, provider, subScheme);
    } else if(_.isObject(subScheme)){
      json[schemeKey] = parse({}, provider, subScheme);
    } else {
      json[schemeKey] = provider[subScheme];
    }
  });
  return json;
};

function executeOperation(json, provider, scheme){
  if(_.has(scheme, '$execute')){
    return parseLayer(provider, scheme.$scheme);
  }
  if(_.has(scheme, '$batch')){
    return batchLayer(provider, scheme.$scheme, scheme.$batch);
  }
};

function parseLayer(provider, scheme){
  return _.map(provider, function(subProvider){
    return parse({}, subProvider, scheme);
  });
};

function batchLayer(provider, scheme, property){
  let groups = _.groupBy(provider, property);
  return _.map(groups, function(group){
     var parsed = parse({}, group, scheme);

     _.forOwn(scheme, function(subScheme, schemeKey) {
       if(schemeKey !== '$parse') {
         if(_.isObject(subScheme)){
           parsed[schemeKey] = parse({}, group[0], subScheme);
         } else {
           parsed[schemeKey] = group[0][subScheme];
         }
       }
     });

     return parsed;
  });
};

/*function parseCollection(provider, scheme){
  if(_.isArray(provider)){
    json = parseArray(provider, scheme);
  } else if(_.isObject(provider)){
    json = parseObject(provider, scheme);
  }
  return json;
};

function parseArray(provider, scheme){
  return _.map(provider, function(subProvider){
    return parse({}, subProvider, scheme);
  });
};

function parseObject(provider, scheme){
  var operation, json = {};
  _.forOwn(scheme, function(subScheme, schemeKey) {
    if(isOperation(schemeKey)){
      operation = parseOperation(schemeKey);
      json[operation.dest] = executeOperation(operation, provider, subScheme);
    } else if(_.isObject(subScheme)){
      json[schemeKey] = parse({}, provider, subScheme);
    } else {
      json[schemeKey] = provider[subScheme];
    }
  });
  return json;
};*/

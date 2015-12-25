'use strict';
var _ 		     = require('lodash');
var core 		   = require('./core');

var Operations = {
  group: 'groupBy',
  index: 'indexBy'
};

function parse(provider, scheme){
  var operation;
  var mirrorScheme = _.pick(scheme, _.isString), json = {};
  var depth = _.omit(scheme, _.isString);
  _.forOwn(depth, function(subScheme, schemeKey) {
    if(isOperation(schemeKey)){
      operation = parseOperation(schemeKey);
      json[operation.dest] = executeOperation(operation, provider, subScheme);
    } else if(_.isObject(subScheme)){
      json[schemeKey] = parse(provider, subScheme);
    }
  });
  if(_.keys(depth).length === 0){
    return core.mirror(provider, mirrorScheme);
  }
  if(_.keys(depth).length > 0){
    return json;
  }
};

function executeOperation(operation, provider, scheme){
  if(operation.name === 'group'){
    var groups = _.groupBy(provider, operation.args);
    var schemeHead = _.pick(scheme, _.isString), toParseScheme, head;
    //console.log('group scheme:', scheme);
    return _.map(groups, function(group){
      //console.log('parsed: ', parse(group, scheme));
      //console.log('head', core.mirror(group[0], schemeHead));
      //console.log(group.length, operation.dest, operation.args);
      head = core.mirror(group[0], schemeHead);
      toParseScheme = _.omit(scheme, _.isString);
      if(_.keys(toParseScheme)['length'] === 0){
        return head;
      } else {
        return _.merge(head, parse(group, toParseScheme));
      }
    });
  }
};

function isOperation(text){
  if(_.startsWith(text, '$')){
    var name = getOperationName(text);
    return _.has(core, Operations[name]);
  }
};

function parseOperation(text){
  if(isOperation(text)){
    return {
      name: getOperationName(text),
      dest: getOperationDestinyKey(text),
      args: getOperationArguments(text)
    }
  }
};

function getOperationName(text){
  return text.match(/\$(\w+)/)[1];
};

function getOperationDestinyKey(text){
  return text.match(/\[(\w+)\]/)[1];
};

function getOperationArguments(text){
  return text.match(/\((\w+)\)/)[1];
};

exports.parse = function(provider, scheme){
  return parse(provider, scheme);
};

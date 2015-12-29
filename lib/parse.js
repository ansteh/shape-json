'use strict';
var core 		   = require('./core');
var forOwn     = require('lodash/object/forOwn');
var omit       = require('lodash/object/omit');
var keys       = require('lodash/object/keys');
var pick       = require('lodash/object/pick');
var extend     = require('lodash/object/extend');
var has        = require('lodash/object/has');
var groupBy    = require('lodash/collection/groupBy');
var map        = require('lodash/collection/map');
var isObject   = require('lodash/lang/isObject');
var isString   = require('lodash/lang/isString');
var isFunction = require('lodash/lang/isFunction');
var startsWith = require('lodash/string/startsWith');

var Operations = {
  group: 'groupBy',
  index: 'indexBy'
};

function parse(provider, scheme){
  var mirrorScheme = pick(scheme, isString), json = {}, operation;
  var depth = omit(scheme, notToParse);
  forOwn(depth, function(subScheme, schemeKey) {
    if(isOperation(schemeKey)){
      operation = parseOperation(schemeKey);
      json[operation.dest] = executeOperation(operation, provider, subScheme);
    } else if(isObject(subScheme)){
      json[schemeKey] = parse(provider, subScheme);
    }
  });
  if(keys(depth).length === 0 && keys(mirrorScheme).length > 0){
    return core.mirror(provider, mirrorScheme);
  }
  if(keys(depth).length > 0){
    return json;
  }
};

function executeOperation(operation, provider, scheme){
  if(operation.name === 'group'){
    var groups = groupBy(provider, operation.args);
    var schemeHead = pick(scheme, isString), toParseScheme, head;
    return map(groups, function(group){
      head = core.mirror(group[0], schemeHead);
      toParseScheme = omit(scheme, isString);
      if(keys(toParseScheme)['length'] === 0){
        return head;
      } else {
        return extend(head, parse(group, toParseScheme));
      }
    });
  }
};

function notToParse(value){
  return isString(value) || isFunction(value);
};

function omitFunctions(scheme){
  return pick(scheme, function(value){
    return isFunction(value) === false;
  });
};

function isOperation(text){
  if(startsWith(text, '$')){
    var name = getOperationName(text);
    return has(core, Operations[name]);
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

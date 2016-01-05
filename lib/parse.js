'use strict';
var core 		   = require('./core');

var _ = {
 map:         require('lodash/collection/map'),
 groupBy:     require('lodash/collection/groupBy'),

 pick:        require('lodash/object/pick'),
 values:      require('lodash/object/values'),
 keys:        require('lodash/object/keys'),
 forOwn:      require('lodash/object/forOwn'),
 omit:        require('lodash/object/omit'),
 extend:      require('lodash/object/extend'),
 has:         require('lodash/object/has'),
 result:      require('lodash/object/result'),

 uniq:        require('lodash/array/uniq'),

 isObject:    require('lodash/lang/isObject'),
 isString:    require('lodash/lang/isString'),
 isFunction:  require('lodash/lang/isFunction'),
 isArray:     require('lodash/lang/isArray'),

 startsWith:  require('lodash/string/startsWith')
};

var Operations = {
  group: 'groupBy',
  index: 'indexBy',
  mirror: 'mirror'
};

function parse(provider, scheme){
  var json = {}, operation;
  _.forOwn(scheme, function(subScheme, schemeKey) {
    if(_.isFunction(subScheme) === false){
      if(isOperation(schemeKey)){
        //console.log('isOperation', schemeKey);
        operation = parseOperation(schemeKey);
        json[operation.dest] = executeOperation(operation, provider, subScheme);
      } else if(_.isString(subScheme)){
        if(_.isArray(provider)) {
          json[schemeKey] = _.result(provider[0], subScheme);
        } else {
          //console.log('isString', subScheme, provider, _.result(provider, subScheme));
          json[schemeKey] = _.result(provider, subScheme);
        }
      } else if(_.isObject(subScheme)){
        json[schemeKey] = parse(provider, subScheme);
      }
    }
  });
  return json;
};

function executeOperation(operation, provider, scheme){
  if(operation.name === 'group'){
    var groups = _.groupBy(provider, operation.args);
    var schemeHead = _.pick(scheme, _.isString), toParseScheme, head;
    var toParseScheme = _.omit(scheme, _.isString);
    return _.map(groups, function(group){
      head = core.mirror(group[0], schemeHead);
      if(_.keys(toParseScheme)['length'] === 0){
        return head;
      } else {
        return _.extend(head, parse(group, toParseScheme));
      }
    });
  }

  if(operation.name === 'mirror'){
    var uniques = _.uniq(provider, operation.args);
    var parsed = _.map(uniques, function(item){
      return parse(item, scheme);
    });
    return parsed;
    return core.mirror(provider, scheme, operation.args);
  }
};

function omitFunctions(scheme){
  return _.pick(scheme, function(value){
    return _.isFunction(value) === false;
  });
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
  var args = text.match(/\((\w+)\)/);
  if(args){
    return args[1];
  }
};

exports.parse = function(provider, scheme){
  return parse(provider, scheme);
};

'use strict';
var core 		   = require('./core');

var _ = {
 map:         require('lodash/map'),
 groupBy:     require('lodash/groupBy'),
 pick:        require('lodash/pick'),
 values:      require('lodash/values'),
 keys:        require('lodash/keys'),
 forOwn:      require('lodash/forOwn'),
 omit:        require('lodash/omit'),
 extend:      require('lodash/extend'),
 has:         require('lodash/has'),
 result:      require('lodash/result'),
 uniq:        require('lodash/uniq'),
 uniqBy:      require('lodash/uniqBy'),
 isObject:    require('lodash/isObject'),
 isString:    require('lodash/isString'),
 isFunction:  require('lodash/isFunction'),
 isArray:     require('lodash/isArray'),
 startsWith:  require('lodash/startsWith'),
 isUndefined: require('lodash/isUndefined'),
 filter:      require('lodash/filter')
};

var Operations = {
  group: 'groupBy',
  index: 'indexBy',
  mirror: 'mirror'
};

var defined = {};

function parse(provider, scheme){
  var json = {}, operation;
  _.forOwn(scheme, function(subScheme, schemeKey) {
    if(_.isFunction(subScheme) === false){
      if(isOperation(schemeKey)){
        operation = parseOperation(schemeKey);
        let parsedCollection = executeOperation(operation, provider, subScheme);
        if(_.isArray(parsedCollection)){
          json[operation.dest] = withoutEmptyObject(parsedCollection);
        } else {
          json[operation.dest] = parsedCollection;
        }
      } else if(_.isString(subScheme)){
        let parsedString = parseSchemeString(provider, subScheme);
        if(parsedString){
          json[schemeKey] = parsedString;
        }
      } else if(_.isObject(subScheme)){
        json[schemeKey] = parse(provider, subScheme);
      }
    }
  });
  return json;
};

function withoutEmptyObject(collection){
  return _.filter(collection, function(value){
    return _.isObject(value) ? _.keys(value).length !== 0 : true;
  });
};

function parseSchemeString(provider, schemeString){
  if(_.isArray(provider)) {
    if(provider.length === 0){
      return [];
    }
    return _.result(provider[0], schemeString);
  } else {
    return _.result(provider, schemeString);
  }
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
    var uniques = _.uniqBy(provider, operation.args);
    return _.map(uniques, function(item){
      return parse(item, scheme);
    });
  }

  if(_.has(defined, operation.name)){
    var modifiedProvider = defined[operation.name](provider);
    return parse(modifiedProvider, scheme);
  }
};

function isOperation(text){
  if(_.startsWith(text, '$')){
    var name = getOperationName(text);
    return _.has(core, Operations[name]) || _.has(defined, name);
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

exports.define = function(name, operation){
  defined[name] = operation;
};

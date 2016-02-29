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
 filter:      require('lodash/filter'),
 isNumber:    require('lodash/isNumber'),
 reduce:      require('lodash/reduce')
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
        let operation = retrieveOperation(schemeKey);
        let parsedOperation = parseSchemeOperation(provider, subScheme, operation);
        if(_.isUndefined(operation.dest)){
          json = parsedOperation;
        } else {
          json[operation.dest] = parsedOperation;
        }
      } else if(_.isString(subScheme)){
        let parsedString = parseSchemeString(provider, subScheme);
        if(parsedString || _.isNumber(parsedString)){
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
    if(_.isObject(value)){
      return _.keys(value).length !== 0;
    }
    return true;
  });
};

function parseSchemeOperation(provider, subScheme, operation){
  let parsedCollection = executeOperation(operation, provider, subScheme);
  if(_.isArray(parsedCollection)){
    parsedCollection = withoutEmptyObject(parsedCollection);
  }
  return parsedCollection;
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

    return _.reduce(groups, function(accu, group, index){
      head = core.mirror(group[0], schemeHead);

      if(group[0][operation.args] || _.isNumber(group[0][operation.args])){

      } else {
        return accu;
      }

      if(_.keys(toParseScheme)['length'] === 0){
        accu.push(head);
      } else {
        accu.push(_.extend(head, parse(group, toParseScheme)));
      }
      return accu;
    }, []);

    /*return _.map(groups, function(group){
      head = core.mirror(group[0], schemeHead);
      if(_.keys(toParseScheme)['length'] === 0){
        return head;
      } else {
        return _.extend(head, parse(group, toParseScheme));
      }
    });*/
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

function retrieveOperation(text){
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
  let segment = text.match(/\[(\w+)\]/);
  if(segment) return segment[1];
};

function getOperationArguments(text){
  var args = text.match(/\((\w+)\)/);
  if(args) return args[1];
};

exports.parse = function(provider, scheme){
  return parse(provider, scheme);
};

exports.define = function(name, operation){
  defined[name] = operation;
};

module.exports = function(operation, provider, scheme, helpers) {
  var _ = helpers._;
  var parse = helpers.parse;
  var core = helpers.core;

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
};

module.exports = function(operation, provider, scheme, helpers) {
  var _ = helpers._;
  var parse = helpers.parse;

  var uniques = _.uniqBy(provider, operation.args);
  return _.map(uniques, function(item){
    return parse(item, scheme);
  });
};

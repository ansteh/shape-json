module.exports = function(operation, provider, scheme, helpers) {
  if(helpers._.isObject(scheme)) {
    return helpers._.extend(provider, scheme);
  }

  return scheme;
};

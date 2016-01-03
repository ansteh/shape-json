'use strict';
var shape = require('../../index.js');
let inputs = require('../resources.js').projects;
let _ = require('lodash');

describe("scheme.form:", function() {
  it("groupBy", function() {
    let scheme = shape
      .scheme()
      .groupBy('pid');

    let result = _.groupBy(inputs, 'pid');
    expect(scheme.form(inputs)).toEqual(result);
  });
});

'use strict';
const shape = require('../../index.js');

const input = require('../nested-objects.js');
const _ = require('lodash');

describe("nested objects as provider", function() {
  it("get single key from provider json by path", function() {
    let scheme = {
      "name": "event.name"
    };

    let result = {
      name: _.get(input.objects[0], "event.name")
    };

    expect(shape.parse(input.objects[0], scheme)).toEqual(result);
  });

  it("simple", function() {
    let scheme = {
      "$mirror(id)": {
        "name": "event.name"
      }
    };

    let result = _.map(input.objects, function(obj){
      return {
        "name": _.get(obj, "event.name")
      };
    });

    //console.log(result);
    //console.log(shape.parse(input.objects, scheme));
    expect(shape.parse(input.objects, scheme)).toEqual(result);
  });
});

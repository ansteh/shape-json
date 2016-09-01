'use strict';
var shape = require('../../index.js');
var _     = require('lodash');
describe("parsing booleans:", function() {
  it("simple", function() {

    let scheme = {
      "boolean": "active",
    };

    let input = { active: true };
    let result = { boolean: true };
    expect(shape.parse(input, scheme)).toEqual(result);
  });

  it("mirror check numbers", function() {
    let scheme = {
      "$mirror": {
        "boolean": "active"
      }
    };

    let input = [{ active: 1 }, { active: 1 }, { active: 1 }];
    let result = [{ boolean: 1 }, { boolean: 1 }, { boolean: 1 }];
    expect(shape.parse(input, scheme)).toEqual(result);
  });

  it("mirror check booleans", function() {
    let scheme = {
      "$mirror": {
        "boolean": "active"
      }
    };

    let input = [{ active: true }, { active: false }, { active: false }];
    let result = [{ boolean: true }, { boolean: false }, { boolean: false }];
    expect(shape.parse(input, scheme)).toEqual(result);
  });

});

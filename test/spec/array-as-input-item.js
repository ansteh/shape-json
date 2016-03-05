'use strict';
const shape = require('../../index.js');
const _ = require('lodash');

describe("array as input item", function() {
  let input = [[1, 'andre']];
  it("simple", function() {
    let scheme = {
      "$mirror(0)": {
        "project": {
          "id": 0,
          "name": 1
        }
      }
    };

    let result = _.map(_.groupBy(input, 'projectID'), function(group){
      let person = group[0];
      return {
        "project": {
          "id": person[0],
          "name": person[1]
        }
      };
    });

    expect(shape.parse(input, scheme)).toEqual(result);
  });
});

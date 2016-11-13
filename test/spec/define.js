'use strict';
var shape = require('../../index.js');
var _     = require('lodash');
describe("defining operation for parsing:", function() {
  it("definition", function() {
    shape.define('growth', function(operation, provider, scheme, helpers){
      var parse = helpers.parse;

      var modifiedProvider = provider.map(function(point){
        point.rate *= 100;
        return point;
      });

      return parse(modifiedProvider, scheme);
    });

    var scheme = {
      "$growth[growth]": {
        "$mirror[rates]": {
          "name": "name",
          "percent": "rate"
        }
      }
    };

    var input = [{
      "name": "test1",
      "rate": 0.1
    },{
      "name": "test2",
      "rate": 0.2
    }];

    let result =
      {
        growth: {
          rates: [
            {
              "name": "test1",
              "percent": 10
            },{
              "name": "test2",
              "percent": 20
            }
          ]
        }
      };
    expect(shape.parse(input, scheme)).toEqual(result);
  });
});

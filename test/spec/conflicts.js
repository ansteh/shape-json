'use strict';
var shape = require('../../index.js');
let input = require('../resources.js').employees;

describe("provider conflicts:", function() {
  it("mirror", function() {
    let scheme = {
      "$mirror[employees](id)": {
        "id": "id",
        "name": "name",
        "prename": "prename"
      }
    };

    let result = {
      employees: [
        {id: 1, name: 'john', prename: 'rambo'},
        {id: 2}
      ]
    };

    expect(shape.parse(input, scheme)).toEqual(result);
  });

  it("unmatched provider keys", function() {
    let scheme = {
      "$mirror[employees](id)": {
        "id": "_id",
        "name": "_name",
        "prename": "_prename"
      }
    };

    let result = {
      employees: []
    };

    expect(shape.parse(input, scheme)).toEqual(result);
  });
});

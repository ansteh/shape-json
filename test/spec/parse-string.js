'use strict';
var shape = require('../../index.js');

describe("strings:", function() {
  it("parse empty string", function() {
    let input = [
      {"Name": "Tom", "Age":20, "Comment":""},
      {"Name": "Jerry", "Age":18, "Comment":"Catch me if you can!"},
    ]

    let scheme = {
      "$mirror[people](Name)": {
        "name": "Name",
        "age": "Age",
        "comment": "Comment"
      }
    };

    let result = {
      people: [
        {name: "Tom", age: 20, comment: ''},
        {name: "Jerry", age: 18, comment: 'Catch me if you can!'},
      ]
    };

    // console.log(JSON.stringify(shape.parse(input, scheme), null, 2));

    expect(shape.parse(input, scheme)).toEqual(result);
  });
});

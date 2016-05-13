'use strict';
var shape = require('../../index.js');

describe("shipped functions:", function() {
  it("core is shipped", function() {
    let keys = ['groupBy', 'indexBy', 'mirror', 'set', 'chain', 'scheme', 'parse', 'define'];
    expect(Object.keys(shape)).toEqual(keys);
  });

  it("mirror", function() {
    let input = {
      pid: 1,
      lastName: 'Stehle',
      firstName: 'Andre'
    };

    let scheme = {
      id: 'pid',
      last_name: 'lastName',
      first_name: 'firstName'
    };

    let result = {
      id: 1,
      last_name: 'Stehle',
      first_name: 'Andre'
    };

    expect(shape.mirror(input, scheme)).toEqual(result);
  });

  it("chain mirror", function() {
    let input = {
      pid: 1,
      lastName: 'Stehle',
      firstName: 'Andre'
    };

    let scheme = {
      id: 'pid',
      last_name: 'lastName',
      first_name: 'firstName'
    };

    let result = {
      id: 1,
      last_name: 'Stehle',
      first_name: 'Andre'
    };

    var chained = shape
      .chain(input)
      .mirror(scheme)
      .collection;

    expect(chained).toEqual(result);
  });
});

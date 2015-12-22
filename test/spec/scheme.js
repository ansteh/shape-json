'use strict';
var shape = require('../../index.js');

describe("scheme module tests:", function() {
  it("create a scheme", function() {
    let scheme = shape
      .scheme()
      .mirror({ id: 'pid', last_name: 'lastName' })
      .indexBy('id');

    let inputs = [{
      pid: 1,
      lastName: 'Stehle',
      firstName: 'Andre'
    },{
      pid: 2,
      lastName: 'lastname',
      firstName: 'firstname'
    }];

    let result = {
      1:{
        id: 1,
        last_name: 'Stehle'
      },
      2:{
        id: 2,
        last_name: 'lastname'
      }
    };

    expect(scheme.form(inputs)).toEqual(result);
  });
});

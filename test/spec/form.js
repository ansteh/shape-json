'use strict';
var shape = require('../../index.js');

let inputs = [
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 1, pojectName: 'project 1', url: "project1.com"},
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 3, pojectName: 'project 3', url: "project3.com"},
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 4, pojectName: 'project 4', url: "project4.com"},
  {pid: 2, lastName: 'Dalton', firstName: 'John',  projectID: 6, pojectName: 'project 6', url: "project6.com"},
  {pid: 2, lastName: 'Dalton', firstName: 'John',  projectID: 7, pojectName: 'project 7', url: "project7.com"}
];

describe("scheme.form:", function() {
  it("groupBy", function() {
    let scheme = shape
      .scheme()
      .mirror({ id: 'pid', last_name: 'lastName' })
      .indexBy('id');

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

    //expect(scheme.form(inputs)).toEqual(result);
  });
});

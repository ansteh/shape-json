'use strict';
var shape = require('../../index.js');

let input = [
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 1, projectName: 'project 1'},
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 1, projectName: 'project 1'},
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 3, projectName: 'project 3'},
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 3, projectName: 'project 3'},
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 4, projectName: 'project 4'},
  {pid: 2, lastName: 'Dalton', firstName: 'John',  projectID: 6, projectName: 'project 6'},
  {pid: 2, lastName: 'Dalton', firstName: 'John',  projectID: 7, projectName: 'project 7'},
  {pid: 2, lastName: 'Dalton', firstName: 'John',  projectID: 7, projectName: 'project 7'}
];

describe("group function:", function() {
  it("group", function() {
    let scheme = {
      "$group[persons](pid)": {
        "id": "pid",
        "last_name": "lastName",
        "first_name": "firstName",
        "$group[projects](projectID)": {
          "id": "projectID",
          "name": "projectName"
        }
      }
    };

    let result = {
      persons: [{
        id: 1,
        last_name: 'Stehle',
        first_name: 'Andre',
        projects: [{
          id: 1,
          name: 'project 1'
        },{
          id: 3,
          name: 'project 3'
        },{
          id: 4,
          name: 'project 4'
        }]
      },{
        id: 2,
        last_name: 'Dalton',
        first_name: 'John',
        projects: [{
          id: 6,
          name: 'project 6'
        },{
          id: 7,
          name: 'project 7'
        }]
      }]
    };

    expect(shape.parse(input, scheme)).toEqual(result);
  });
});

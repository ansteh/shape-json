'use strict';
var shape = require('../../index.js');

let input = [
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 1, projectName: 'project 1', url: 'project1_1.com', urlID: 1},
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 1, projectName: 'project 1', url: 'project1_2.com', urlID: 2},
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 3, projectName: 'project 3', url: 'project3_1.com', urlID: 3},
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 3, projectName: 'project 3', url: 'project3_2.com', urlID: 4},
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 4, projectName: 'project 4', url: 'project4_1.com', urlID: 5},
  {pid: 2, lastName: 'Dalton', firstName: 'John',  projectID: 6, projectName: 'project 6', url: 'project6_1.com', urlID: 6},
  {pid: 2, lastName: 'Dalton', firstName: 'John',  projectID: 7, projectName: 'project 7', url: 'project7_1.com', urlID: 7},
  {pid: 2, lastName: 'Dalton', firstName: 'John',  projectID: 7, projectName: 'project 7', url: 'project7_2.com', urlID: 8}
];

describe("group function:", function() {
  it("group", function() {
    var persons = shape.group(input, 'pid', {
      "id": "pid",
      "last_name": "lastName",
      "first_name": "firstName"
    }, {
      "projects": {
        "id": "projectID",
        "name": "projectName"
      }
    });

    let result = [{
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
    }];

    //expect(persons).toEqual(result);
  });
});

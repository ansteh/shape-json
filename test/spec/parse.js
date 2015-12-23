'use strict';
var shape = require('../../index.js');

let inputs = [
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 1, projectName: 'project 1', url: 'project1.com'},
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 3, projectName: 'project 3', url: 'project3.com'},
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 4, projectName: 'project 4', url: 'project4.com'},
  {pid: 2, lastName: 'Dalton', firstName: 'John',  projectID: 6, projectName: 'project 6', url: 'project6.com'},
  {pid: 2, lastName: 'Dalton', firstName: 'John',  projectID: 7, projectName: 'project 7', url: 'project7.com'}
];

describe("scheme form", function() {
  it("simple parse equals mirror", function() {
    let scheme = {
      "id": "projectID",
      "name": "projectName",
      "url": "url"
    };

    let result = [{
      id: 1,
      name: 'project 1',
      url: 'project1.com'
    },{
      id: 3,
      name: 'project 3',
      url: 'project3.com'
    },{
      id: 4,
      name: 'project 4',
      url: 'project4.com'
    },{
      id: 6,
      name: 'project 6',
      url: 'project6.com'
    },{
      id: 7,
      name: 'project 7',
      url: 'project7.com'
    }];

    expect(shape.parse(inputs, scheme)).toEqual(result);
  });

  it("parse", function() {
    let scheme = {
      "$group[persons](pid)": {
        "id": "pid",
        "last_name": "lastName",
        "first_name": "firstName",
        "projects": {
          "id": "projectID",
          "name": "projectName",
          "url": "url"
        }
      }
    };

    /*var scheme = shape.scheme()
      .mirror({
        "id": "pid",
        "last_name": "lastName",
        "first_name": "firstName",
      })
      .group('projects', 'pid', {
        "id": "projectID",
        "name": "projectName",
        "url": "url"
      });*/

    let result = [{
      id: 1,
      last_name: 'Stehle',
      first_name: 'Andre',
      projects: [{
        id: 1,
        name: 'project 1',
        url: 'project1.com'
      },{
        id: 3,
        name: 'project 3',
        url: 'project3.com'
      },{
        id: 4,
        name: 'project 4',
        url: 'project4.com'
      }]
    },{
      id: 2,
      last_name: 'Dalton',
      first_name: 'John',
      projects: [{
        id: 6,
        name: 'project 6',
        url: 'project6.com'
      },{
        id: 7,
        name: 'project 7',
        url: 'project7.com'
      }]
    }];
    expect(shape.parse(inputs, scheme).persons).toEqual(result);
  });
});

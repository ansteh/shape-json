'use strict';
var shape = require('../../index.js');

let inputs = [
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 1, projectName: 'project 1', url: 'project1.com'},
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 3, projectName: 'project 3', url: 'project3.com'},
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 4, projectName: 'project 4', url: 'project4.com'},
  {pid: 2, lastName: 'Dalton', firstName: 'John',  projectID: 6, projectName: 'project 6', url: 'project6.com'},
  {pid: 2, lastName: 'Dalton', firstName: 'John',  projectID: 7, projectName: 'project 7', url: 'project7.com'}
];

let inputsWithUrls = [
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 1, projectName: 'project 1', url: 'project1_1.com', urlID: 1},
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 1, projectName: 'project 1', url: 'project1_2.com', urlID: 2},
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 3, projectName: 'project 3', url: 'project3_1.com', urlID: 3},
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 3, projectName: 'project 3', url: 'project3_2.com', urlID: 4},
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 4, projectName: 'project 4', url: 'project4_1.com', urlID: 5},
  {pid: 2, lastName: 'Dalton', firstName: 'John',  projectID: 6, projectName: 'project 6', url: 'project6_1.com', urlID: 6},
  {pid: 2, lastName: 'Dalton', firstName: 'John',  projectID: 7, projectName: 'project 7', url: 'project7_1.com', urlID: 7},
  {pid: 2, lastName: 'Dalton', firstName: 'John',  projectID: 7, projectName: 'project 7', url: 'project7_2.com', urlID: 8}
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

  it("parse group persons", function() {
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

  it("parse group persons and urls", function() {
    let scheme = {
      "$group[persons](pid)": {
        "id": "pid",
        "last_name": "lastName",
        "first_name": "firstName",
        "$group[projects](projectID)": {
          "id": "projectID",
          "name": "projectName",
          "$group[urls](urlID)": {
            "id" : "urlID",
            "name": "url"
          }
        }
      }
    };

    let result = [{
      id: 1,
      last_name: 'Stehle',
      first_name: 'Andre',
      projects: [{
        id: 1,
        name: 'project 1',
        urls: [{
          id: 1,
          name: 'project1_1.com'
        },{
          id: 2,
          name: 'project1_2.com'
        }]
      },{
        id: 3,
        name: 'project 3',
        urls: [{
          id: 3,
          name: 'project3_1.com'
        },{
          id: 4,
          name: 'project3_2.com'
        }]
      },{
        id: 4,
        name: 'project 4',
        urls: [{
          id: 5,
          name: 'project4_1.com'
        }]
      }]
    },{
      id: 2,
      last_name: 'Dalton',
      first_name: 'John',
      projects: [{
        id: 6,
        name: 'project 6',
        urls: [{
          id: 6,
          name: 'project6_1.com'
        }]
      },{
        id: 7,
        name: 'project 7',
        urls: [{
          id: 7,
          name: 'project7_1.com'
        },{
          id: 8,
          name: 'project7_2.com'
        }]
      }]
    }];
    expect(shape.parse(inputsWithUrls, scheme).persons).toEqual(result);
  });

  it("parse group persons and urls avoiding embedded functions in scheme", function() {
    let scheme = {
      "$group[persons](pid)": {
        "id": "pid",
        "last_name": "lastName",
        "first_name": "firstName",
        "$group[projects](projectID)": {
          "id": "projectID",
          "name": "projectName",
          "$group[urls](urlID)": {
            "id" : "urlID",
            "name": "url",
            renameProperty: function(){
              console.log('avoid it!');
            }
          }
        }
      }
    };

    let result = [{
      id: 1,
      last_name: 'Stehle',
      first_name: 'Andre',
      projects: [{
        id: 1,
        name: 'project 1',
        urls: [{
          id: 1,
          name: 'project1_1.com'
        },{
          id: 2,
          name: 'project1_2.com'
        }]
      },{
        id: 3,
        name: 'project 3',
        urls: [{
          id: 3,
          name: 'project3_1.com'
        },{
          id: 4,
          name: 'project3_2.com'
        }]
      },{
        id: 4,
        name: 'project 4',
        urls: [{
          id: 5,
          name: 'project4_1.com'
        }]
      }]
    },{
      id: 2,
      last_name: 'Dalton',
      first_name: 'John',
      projects: [{
        id: 6,
        name: 'project 6',
        urls: [{
          id: 6,
          name: 'project6_1.com'
        }]
      },{
        id: 7,
        name: 'project 7',
        urls: [{
          id: 7,
          name: 'project7_1.com'
        },{
          id: 8,
          name: 'project7_2.com'
        }]
      }]
    }];
    expect(shape.parse(inputsWithUrls, scheme).persons).toEqual(result);
  });

  it("parse group persons and urls as a scheme", function() {
    let result = [{
      id: 1,
      last_name: 'Stehle',
      first_name: 'Andre',
      projects: [{
        id: 1,
        name: 'project 1',
        urls: [{
          id: 1,
          name: 'project1_1.com'
        },{
          id: 2,
          name: 'project1_2.com'
        }]
      },{
        id: 3,
        name: 'project 3',
        urls: [{
          id: 3,
          name: 'project3_1.com'
        },{
          id: 4,
          name: 'project3_2.com'
        }]
      },{
        id: 4,
        name: 'project 4',
        urls: [{
          id: 5,
          name: 'project4_1.com'
        }]
      }]
    },{
      id: 2,
      last_name: 'Dalton',
      first_name: 'John',
      projects: [{
        id: 6,
        name: 'project 6',
        urls: [{
          id: 6,
          name: 'project6_1.com'
        }]
      },{
        id: 7,
        name: 'project 7',
        urls: [{
          id: 7,
          name: 'project7_1.com'
        },{
          id: 8,
          name: 'project7_2.com'
        }]
      }]
    }];

    let scheme = shape
      .scheme()
      .parse({
        "$group[persons](pid)": {
          "id": "pid",
          "last_name": "lastName",
          "first_name": "firstName",
          "$group[projects](projectID)": {
            "id": "projectID",
            "name": "projectName",
            "$group[urls](urlID)": {
              "id" : "urlID",
              "name": "url"
            }
          }
        }
      });

    expect(scheme.form(inputsWithUrls).persons).toEqual(result);
  });
});

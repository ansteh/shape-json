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
      .groupBy('pid');

    let result = {
      1:[
        {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 1, pojectName: 'project 1', url: "project1.com"},
        {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 3, pojectName: 'project 3', url: "project3.com"},
        {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 4, pojectName: 'project 4', url: "project4.com"}
      ],
      2:[
        {pid: 2, lastName: 'Dalton', firstName: 'John',  projectID: 6, pojectName: 'project 6', url: "project6.com"},
        {pid: 2, lastName: 'Dalton', firstName: 'John',  projectID: 7, pojectName: 'project 7', url: "project7.com"}
      ]
    };

    expect(scheme.form(inputs)).toEqual(result);
  });
});

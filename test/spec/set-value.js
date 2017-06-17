'use strict';
const shape = require('../../index.js');

const input = require('../resources.js').readme;
const _ = require('lodash');

describe("set value", function() {

  it("simple assign", function() {
    var scheme = {
      "id": "pid",
      "$set[active]": true, // true in all objects
    };

    let result = { id: 1, active: true };

    expect(shape.parse(input, scheme)).toEqual(result);
  });

  it("$group", function() {
    var scheme = {
      "$group[contributors](pid)": {
        "id": "pid",
        "$set[active]": true, // true in all objects
      }
    };

    let result = {
      contributors: _.map(_.groupBy(input, 'pid'), function(group){
        let person = group[0];
        return {
          "id": person.pid,
          "active": true
        }
      })
    };

    expect(shape.parse(input, scheme)).toEqual(result);
  });

  it("proposed case", function() {
    var scheme = {
      "$group[contributors](pid)": {
        "id": "pid",
        "name": "contributor",
        "$set[active]": true, // true in all objects
        "$group[projects](projectID)": {
          "id": "projectID",
          "name": "projectName"
        }
      }
    };

    let result = {
      contributors: _.map(_.groupBy(input, 'pid'), function(group){
        let person = group[0];
        return {
          "id": person.pid,
          "name": person.contributor,
          "active": true,
          "projects": _.map(_.groupBy(group, 'projectID'), function(projects){
            let project = projects[0];
            return {
              "id": project.projectID,
              "name": project.projectName
            };
          })
        }
      })
    };

    expect(shape.parse(input, scheme)).toEqual(result);
  });

  it("all parsed schemes are perserved", function() {
    let scheme = {
      "name": "name",
      "$set": {
        "phrases": ["text1", "text2", "some more text"]
      },
    };

    let input = { name: 'jmdjr' };

    let result = {
      name: 'jmdjr',
      phrases: [ 'text1', 'text2', 'some more text' ]
    };

    expect(shape.parse(input, scheme)).toEqual(result);
  });
});

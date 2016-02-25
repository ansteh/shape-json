'use strict';
const shape = require('../../index.js');

const input = require('../resources.js').readme;
const _ = require('lodash');

describe("readme", function() {
  it("group contributors example", function() {
    let scheme = {
      "$group[contributors](pid)": {
        "id": "pid",
        "name": "contributor",
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

  it("group projects example", function() {
    var scheme = {
      "$group[projects](projectID)": {
        "id": "projectID",
        "name": "projectName",
        "$group[contributors](pid)": {
          "id": "pid",
          "name": "contributor"
        }
      }
    };

    var result = {
      projects: _.map(_.groupBy(input, 'projectID'), function(group){
        let person = group[0];
        return {
          "id": person.projectID,
          "name": person.projectName,
          "contributors": _.map(_.groupBy(group, 'pid'), function(projects){
            let project = projects[0];
            return {
              "id": project.pid,
              "name": project.contributor
            };
          })
        }
      })
    };
    expect(shape.parse(input, scheme)).toEqual(result);
  });

  it("list projects example", function() {
    let scheme = {
      "$mirror[projects](projectID)": {
        "id": "projectID",
        "name": "projectName"
      }
    };

    let result = {
      projects: _.map(_.groupBy(input, 'projectID'), function(group){
        let person = group[0];
        return {
          "id": person.projectID,
          "name": person.projectName
        }
      })
    };
    expect(shape.parse(input, scheme)).toEqual(result);
  });

  it("list projects example (nesting included)", function() {
    let scheme = {
      "$mirror[projects](projectID)": {
        "project": {
          "id": "projectID",
          "name": "projectName"
        }
      }
    };

    let result = {
      projects: _.map(_.groupBy(input, 'projectID'), function(group){
        let person = group[0];
        return {
          "project": {
            "id": person.projectID,
            "name": person.projectName
          }
        };
      })
    };
    expect(shape.parse(input, scheme)).toEqual(result);
  });

  it("list projects example (nesting included) miss project key", function() {
    let scheme = {
      "$mirror(projectID)": {
        "project": {
          "id": "projectID",
          "name": "projectName"
        }
      }
    };

    let result = _.map(_.groupBy(input, 'projectID'), function(group){
      let person = group[0];
      return {
        "project": {
          "id": person.projectID,
          "name": person.projectName
        }
      };
    });

    expect(shape.parse(input, scheme)).toEqual(result);
  });
});

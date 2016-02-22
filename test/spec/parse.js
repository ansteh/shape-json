'use strict';
var shape = require('../../index.js');

let input = require('../resources.js').projects;
let _ = require('lodash');

let groupedUrls = _.map(_.groupBy(input, 'pid'), function(group){
  let person = group[0];
  return {
    "id": person.pid,
    "last_name": person.lastName,
    "first_name": person.firstName,
    "projects": _.map(_.groupBy(group, 'projectID'), function(projects){
      let project = projects[0];
      return {
        "id": project.projectID,
        "name": project.projectName,
        "urls": _.map(projects, function(url){
          return {
            "id" : url.urlID,
            "name": url.url
          };
        })
      };
    })
  }
});
//console.log(groupedUrls[0]['projects'][0]);

let groupedProjects = _.map(_.groupBy(input, 'pid'), function(group){
  let person = group[0];
  return {
    "id": person.pid,
    "last_name": person.lastName,
    "first_name": person.firstName,
    "projects": _.uniqBy(_.map(group, function(project){
      return {
        "id": project.projectID,
        "name": project.projectName
      };
    }), 'id')
  };
});

//console.log(groupedProjects);

describe("scheme form", function() {
  it("simple parse equals mirror", function() {
    let scheme = {
      '$mirror[persons]': {
        "id": "projectID",
        "name": "projectName",
        "url": "url"
      }
    };

    let result = {
      persons: _.map(input, function(project){
        return {
          "id": project.projectID,
          "name": project.projectName,
          "url": project.url
        };
      })
    };

    expect(shape.parse(input, scheme)).toEqual(result);
  });

  it("single object mirror", function() {
    let scheme = {
      "id": "pid",
      "last_name": "lastName",
      "first_name": "firstName"
    };

    let result = {
      "id": input[0].pid,
      "last_name": input[0].lastName,
      "first_name": input[0].firstName
    };

    expect(shape.parse([input[0]], scheme)).toEqual(result);
  });

  it("parse a first row to a single nested object (just default key mapping)", function() {
    let scheme = {
      "person": {
        "id": "pid",
        "last_name": "lastName",
        "first_name": "firstName"
      }
    };

    let firstRow = _.first(input);
    let result = {
      "person": {
        "id": firstRow.pid,
        "last_name": firstRow.lastName,
        "first_name": firstRow.firstName
      }
    };

    expect(shape.parse(input, scheme)).toEqual(result);
  });

  it("nested parsing equals nested object with just key mapping", function() {
    let scheme = {
      "$mirror[persons](pid)": {
        "person": {
          "id": "pid",
          "last_name": "lastName",
          "first_name": "firstName",
        }
      }
    };

    let result = {
      persons: _.map(_.uniqBy(input, 'pid'), function(person){
        return {
          person: {
            "id": person.pid,
            "last_name": person.lastName,
            "first_name": person.firstName,
          }
        };
      })
    };

    expect(shape.parse(input, scheme)).toEqual(result);
  });

  it("parse projects with a single depth", function() {
    let scheme = {
      "$group[persons](pid)": {
        "id": "pid",
        "last_name": "lastName",
        "first_name": "firstName",
        "$mirror[projects](projectID)": {
          "id": "projectID",
          "name": "projectName"
        }
      }
    };

    //console.log(shape.parse(input, scheme).persons[0]);
    //console.log(groupedProjects[0]);
    expect(shape.parse(input, scheme).persons).toEqual(groupedProjects);
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
    expect(shape.parse(input, scheme).persons).toEqual(groupedUrls);
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

    expect(shape.parse(input, scheme).persons).toEqual(groupedUrls);
  });

  it("parse group persons and urls as a scheme", function() {
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

    expect(scheme.form(input).persons).toEqual(groupedUrls);
  });
});

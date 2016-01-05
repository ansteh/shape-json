//console.log('isOperation', isOperation('$group[projects](pid)'));
//console.log(parseOperation('$group[projects](pid)'));

let inputs = [
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 1, projectName: 'project 1', url: 'project1.com'},
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 3, projectName: 'project 3', url: 'project3.com'},
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 4, projectName: 'project 4', url: 'project4.com'},
  {pid: 2, lastName: 'Dalton', firstName: 'John',  projectID: 6, projectName: 'project 6', url: 'project6.com'},
  {pid: 2, lastName: 'Dalton', firstName: 'John',  projectID: 7, projectName: 'project 7', url: 'project7.com'}
];

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

console.log(parse(inputs, scheme));

/*var users = {
  'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
};

var ages = {
  'data': [{ 'age': 36 }, { 'age': 40 }]
};

console.log(_.merge(users, ages));*/

let groupScheme = {
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

let groupedResults = [{
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

console.log('persons 0 project: ', parse(inputs, groupScheme)['persons'][0]['projects']);
console.log('urls: ', parse(inputs, groupScheme)['persons'][0]['urls']);
console.log('persons: ', parse(inputs, groupScheme));

var input = {
  projects: [
    {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 1, projectName: 'project 1', url: 'project1_1.com', urlID: 1},
    {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 1, projectName: 'project 1', url: 'project1_2.com', urlID: 2},
    {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 3, projectName: 'project 3', url: 'project3_1.com', urlID: 3},
    {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 3, projectName: 'project 3', url: 'project3_2.com', urlID: 4},
    {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 4, projectName: 'project 4', url: 'project4_1.com', urlID: 5},
    {pid: 2, lastName: 'Dalton', firstName: 'John',  projectID: 6, projectName: 'project 6', url: 'project6_1.com', urlID: 6},
    {pid: 2, lastName: 'Dalton', firstName: 'John',  projectID: 7, projectName: 'project 7', url: 'project7_1.com', urlID: 7},
    {pid: 2, lastName: 'Dalton', firstName: 'John',  projectID: 7, projectName: 'project 7', url: 'project7_2.com', urlID: 8}
  ]
};

/*console.log(parse.parse([input.projects[0]], {
  "id": "pid",
  "last_name": "lastName",
  "first_name": "firstName"
}));*/

/*var firstRow = input.projects[0];
var result = {
  "person": {
    "id": firstRow.pid,
    "last_name": firstRow.lastName,
    "first_name": firstRow.firstName
  }
};
var parsed = parse.parse(firstRow,{
  "person": {
    "id": "pid",
    "last_name": "lastName",
    "first_name": "firstName"
  }
});
console.log(JSON.stringify(parsed) === JSON.stringify(result));*/

var _ = require('lodash');
var result = {
  persons: _.map(_.uniq(input.projects, 'pid'), function(person){
    return {
      person: {
        "id": person.pid,
        "last_name": person.lastName,
        "first_name": person.firstName,
      }
    };
  })
};
var parsed = parse.parse(input.projects,{
  "$mirror[persons](pid)": {
    "person": {
      "id": "pid",
      "last_name": "lastName",
      "first_name": "firstName",
    }
  }
});
console.log(parsed);
console.log(JSON.stringify(parsed) === JSON.stringify(result));

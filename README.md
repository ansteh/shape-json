## Installation

Using npm:
```js
npm install shape-json
```
In Node.js/io.js:

```js
var shape = require('shape-json');
```

## Parse input by a scheme defined as json.
```js
var input = [
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 1, projectName: 'project 1'},
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 1, projectName: 'project 1'},
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 3, projectName: 'project 3'},
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 3, projectName: 'project 3'},
  {pid: 1, lastName: 'Stehle', firstName: 'Andre', projectID: 4, projectName: 'project 4'},
  {pid: 2, lastName: 'Dalton', firstName: 'John',  projectID: 6, projectName: 'project 6'},
  {pid: 2, lastName: 'Dalton', firstName: 'John',  projectID: 7, projectName: 'project 7'},
  {pid: 2, lastName: 'Dalton', firstName: 'John',  projectID: 7, projectName: 'project 7'}
];

var scheme = {
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

console.log(shape.parse(input, scheme));
/*
  {
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
  }
*/
```

## Create a scheme as object.
```js
var scheme = shape.scheme()
  .mirror({ id: 'pid', last_name: 'lastName' })
  .indexBy('id');
```

## Apply a scheme.
```js
var inputs = [{
  pid: 1,
  lastName: 'Stehle',
  firstName: 'Andre'
},{
  pid: 2,
  lastName: 'lastname',
  firstName: 'firstname'
}];

console.log(scheme.form(inputs));
/*
  {
    1:{
      id: 1,
      last_name: 'Stehle'
    },
    2:{
      id: 2,
      last_name: 'lastname'
    }
  }
*/
```

## API Documentation

## mirror a collection
Mirror a json by a scheme.

```js
var input = {
  pid: 1,
  lastName: 'Stehle',
  firstName: 'Andre'
};
var scheme = {
  id: 'pid',
  last_name: 'lastName',
};

console.log(shape.mirror(input, scheme));
/*
  {
    id: 1,
    last_name: 'Stehle'
  }
*/


var inputs = [{
  pid: 1,
  lastName: 'Stehle',
  firstName: 'Andre'
},{
  pid: 2,
  lastName: 'lastname',
  firstName: 'firstname'
}];

console.log(shape.mirror(inputs, scheme));
/*
  [{
    id: 1,
    last_name: 'Stehle'
  },{
    id: 2,
    last_name: 'lastname'
  }]
*/
```

## indexing
Index an Array by a key.

```js
var inputs = [{
  id: 1,
  last_name: 'Stehle'
},{
  id: 2,
  last_name: 'lastname'
}];

console.log(shape.indexBy(inputs, 'id'));
/*
  {
    1:{
      id: 1,
      last_name: 'Stehle'
    },
    2:{
      id: 2,
      last_name: 'lastname'
    }
  }
*/
```
## chaining
Chaining previous examples.

```js
var inputs = [{
  pid: 1,
  lastName: 'Stehle',
  firstName: 'Andre'
},{
  pid: 2,
  lastName: 'lastname',
  firstName: 'firstname'
}];

var result = shape.chain(inputs)
  .mirror(scheme)
  .indexBy('id')
  .collection;
console.log(result);
/*
  {
    1:{
      id: 1,
      last_name: 'Stehle'
    },
    2:{
      id: 2,
      last_name: 'lastname'
    }
  }
*/
```

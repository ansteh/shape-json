The motivation behind this module is to reduce the amount of code for json object transformations. The concept implemented to achieve this, is: WYSIWYG.

The idea is to define a json object that includes the transformation instructions, but at the same time reveals the same nesting structure as the output object.
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
Consider you want to transform the below flat json object, into a nested json object we used to from MEAN stack.
```js
var input = [
  {pid: 1, contributor: 'jdalton', projectID: 1, projectName: 'lodash'},
  {pid: 1, contributor: 'jdalton', projectID: 2, projectName: 'docdown'},
  {pid: 1, contributor: 'jdalton', projectID: 3, projectName: 'lodash-cli'},
  {pid: 2, contributor: 'contra',  projectID: 4, projectName: 'gulp'},
  {pid: 3, contributor: 'phated',  projectID: 4, projectName: 'gulp'},
]
```
Instead of producing a lot of duplicated code to accomplish such transformations. We declare a scheme as a json object. This is 'what you see':
```js
var scheme = {
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
console.log(shape.parse(input, scheme));
```
The result 'is what you get':
```json
{
  "contributors": [
    {
      "id": 1,
      "name": "jdalton",
      "projects": [
        {
          "id": 1,
          "name": "lodash"
        },
        {
          "id": 2,
          "name": "docdown"
        },
        {
          "id": 3,
          "name": "lodash-cli"
        }
      ]
    },
    {
      "id": 2,
      "name": "contra",
      "projects": [
        {
          "id": 4,
          "name": "gulp"
        }
      ]
    },
    {
      "id": 3,
      "name": "phated",
      "projects": [
        {
          "id": 4,
          "name": "gulp"
        }
      ]
    }
  ]
}
```
Another example:
```js
var scheme = {
  "$mirror[projects](projectID)": {
    "project": {
      "id": "projectID",
      "name": "projectName"
    }
  }
};
console.log(shape.parse(input, scheme));
```
```json
{
  "projects": [
    {
      "project": {
        "id": 1,
        "name": "lodash"
      }
    },
    {
      "project": {
        "id": 2,
        "name": "docdown"
      }
    },
    {
      "project": {
        "id": 3,
        "name": "lodash-cli"
      }
    },
    {
      "project": {
        "id": 4,
        "name": "gulp"
      }
    }
  ]
}
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

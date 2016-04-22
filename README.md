## Installation

Using npm:

```js
npm install shape-json
```
In Node.js:

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
Instead of producing a lot of duplicated code to accomplish such transformations. We declare a scheme as a json object:
```js
var scheme = {
  "$group[contributors](pid)": {
    "id": "pid",
    "name": "contributor",
    "$group[projects](projectID)": {
      "id": "projectID",
      "name": "projectName"
    }
  }
};
console.log(shape.parse(input, scheme));
```
This is what you get:
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

The same example as above as Array:
```js
var scheme = {
  "$mirror(projectID)": {
    "project": {
      "id": "projectID",
      "name": "projectName"
    }
  }
};
console.log(shape.parse(input, scheme));
```
```json
[
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
```

## Extend parse method with own operation
```js
shape.define('growth', function(provider, scheme){
  return provider.map(function(point){
    point.rate *= 100;
    return point;
  });
});

var scheme = {
  "$growth[growth]": {
    "$mirror[rates]": {
      "name": "name",
      "percent": "rate"
    }
  }
};

var input = [
  {
    "name": "test1",
    "rate": 0.1
  },{
    "name": "test2",
    "rate": 0.2
  }
];

var result = shape.parse(input, scheme);
//result equals:
{
  growth: {
    rates: [
      {
        "name": "test1",
        "percent": 10
      },{
        "name": "test2",
        "percent": 20
      }
    ]
  }
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

## License

MIT © [Andre Stehle](https://github.com/ansteh)

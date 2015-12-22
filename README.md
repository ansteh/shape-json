## mirror a collection
Mirror a json by a scheme.

```js
var shape = require('shape-json');
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
```

# simple.transform
Transform any object Functionally -- a deep recursive JavaScript object transformer.

## Require
```javascript
const {transformObject, transformArray} = require(`simple.transform`);
// Or if you only use transform -- transform() is an alias of transformObject()
const {transform} = require(`simple.transform`);
```

## Use Case
Assume you get a big JSON object to modify for some specific properties to change structure(e.g. for all keys called `SPEC_ID` no matter how deeply nested, change original stucture `{SPEC_ID:"007"}` into `{SPEC_ID:{value:007}}` or `{deprecated:{SPEC_ID:007}}`).

## Design
`simple.transform` offers two simple API `transformObject(input, fn, ...rest)` and `transformArray(input, fn, ...rest)` that recursively process the `input` object (it simply returns `input` if that is not in type `object`) and *feed every single `object `into `fn` for `transformObject()` and every single `Array` into `fn` for `transformArray()`*.

So, you can safely assume the `first input` of `fn` is always a valid `object` or `Array` when you are writing `fn` -- which is a simple pattern matching transform function.

The only limitation for `fn` in `transformObject()` is that **must return an object**, as its return is passed into `lodash.merge()` as `source`.

## Detailed Example
*[NOTE] Again, `transform()` is just an alias of `transformObject()`.*
- e.g. Change all `SPEC_ID` properties from format `{SPEC_ID:"007"}` into `{SPEC_ID:{value:007}}`.
```javascript
const TRANSFORMED = transform(SOURCE_OBJECT, obj => obj.SPEC_ID ? {SPEC_ID:{value:obj.SPEC_ID}} : obj);
```

- e.g. Change all `SPEC_ID` properties from format `{SPEC_ID:"007"}` into `{deprecated:{SPEC_ID:007}}`, if `{deprecated}` is an existing property with value in object, the change will merge into the existing object.
```javascript
const TRANSFORMED = transformObject(SOURCE_OBJECT, obj => obj.SPEC_ID ? {deprecated:{SPEC_ID:obj.SPEC_ID}} : obj);
```

- e.g. Remove all `SPEC_ID` properties from format `{SPEC_ID:"007"}`.
```javascript
const TRANSFORMED = transformObject(SOURCE_OBJECT, obj => obj.SPEC_ID && typeof obj.SPEC_ID === 'string' ? {} : obj);
// OR
const TRANSFORMED = transformObject(SOURCE_OBJECT, obj => obj.SPEC_ID && typeof obj.SPEC_ID === 'string' ? undefined : obj);
```

- e.g. Change all `SPEC_ID` properties from format `{SPEC_ID:"007"}` into `{SPEC_ID:[7]}`
```javascript
const TRANSFORMED = transformObject(SOURCE_OBJECT, obj => obj.SPEC_ID ? {SPEC_ID:[parseInt(obj.SPEC_ID)]} : obj);
```

- Array example - e.g. Change all array in format `["key1", "key2", ...]` into `[{value:"key1"}, {value:"key2"}, ...]`
```javascript
const TRANSFORMED = transformArray(SOURCE_OBJECT, arr => arr.length && typeof arr[0] === 'string' ? arr.map(x => ({value:x})) : arr);
```

### More examples can be found in [test.js](/test.js).

## Lisense

Licensed under MIT Copyright (c) 2017 Phoenix Song

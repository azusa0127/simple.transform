const { transform, transformArray } = require('./index');
const { diff } = require(`deep-diff`);
const { inspect } = require('util');
const SAMPLE_INPUT = {
  glossary: {
    title: 'example glossary',
    GlossDiv: {
      title: 'S',
      GlossList: {
        GlossEntry: {
          ID: 'SGML',
          SortAs: 'SGML',
          GlossTerm: 'Standard Generalized Markup Language',
          Acronym: 'SGML',
          Abbrev: 'ISO 8879:1986',
          GlossDef: {
            para: 'A meta-markup language, used to create markup languages such as DocBook.',
            GlossSeeAlso: ['GML', 'XML'],
          },
          GlossSee: 'markup',
        },
      },
    },
  },
};
// transform / transformObject demo
const TRANSFORMED = transform(SAMPLE_INPUT, obj => (obj.ID ? { ID: { value: obj.ID } } : obj));
const DELETED = transform(SAMPLE_INPUT, obj => (obj.Acronym ? {} : obj));
const MERGED = transform(SAMPLE_INPUT, obj => (obj.ID ? { GlossDef: { ID: obj.ID } } : obj));
const MORE_TRANSFORMED = transform(
  SAMPLE_INPUT,
  obj =>
    obj.GlossSeeAlso && obj.GlossSeeAlso.length && typeof obj.GlossSeeAlso[0] !== 'object'
      ? { GlossSeeAlso: obj.GlossSeeAlso.reduce((acc, x) => [...acc, { value: x }], []) }
      : obj,
);
// transformArray demo
const ARRAY_TRANSFORMED = transformArray(SAMPLE_INPUT, arr => arr.map((x, i) => `${i}-${x}`));

console.log(`### Diff after ID transformed.`);
console.log(inspect(diff(SAMPLE_INPUT, TRANSFORMED)));
console.log(`### Diff after Acronym deleted.`);
console.log(inspect(diff(SAMPLE_INPUT, DELETED)));
console.log(`### Diff after ID merged into GlossDef.`);
console.log(inspect(diff(SAMPLE_INPUT, MERGED)));
console.log(`### Diff after GlossSeeAlso format transformed.`);
console.log(inspect(diff(SAMPLE_INPUT, MORE_TRANSFORMED)));
console.log(`### Diff after array transformed.`);
console.log(inspect(diff(SAMPLE_INPUT, ARRAY_TRANSFORMED)));

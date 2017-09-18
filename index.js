const merge = require(`lodash.merge`);
/**
 * Recursively transform an object with fn applied to every object properties.
 *
 * @param {any} input Input object, though can be any type.
 * @param {Function} fn The transfomation function in format (object, ...args) => object;
 * @param {...any} args Extra params passed into fn.
 *
 * @return {any} transformed object;
 */
const transformObject = (input, fn, ...args) =>
  typeof input === 'object'
    ? Array.isArray(input)
      ? input.map(x => transformObject(x, fn, ...args))
      : Object.keys(input)
          .map(k => fn({ [k]: transformObject(input[k], fn, ...args) }))
          .reduce((acc, x) => merge(acc, x), {})
    : input;

/**
 * Recursively transform all arrays with fn applied to every array from the deepest out.
 *
 * @param {any} input Input object, though can be any type.
 * @param {Function} fn The transfomation function in format (any[], ...args) => any;
 * @param {...any} args Extra params passed into fn.
 *
 * @return {any} transformed object;
 */
const transformArray = (input, fn, ...args) =>
  typeof input === 'object'
    ? Array.isArray(input)
      ? fn(input.map(x => transformArray(x, fn, ...args)), ...args)
      : Object.keys(input)
          .map(k => ({ [k]: transformArray(input[k], fn, ...args) }))
          .reduce((acc, x) => merge(acc, x), {})
    : input;

module.exports = {
  transform: transformObject,
  transformObject,
  transformArray,
};

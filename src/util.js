/**
 * @param {*} o
 * @return {boolean}
 */
export function isPlainObject(o) {
  return typeof o === 'object' && !isArray(o) && o != null;
}

/**
 * @param {*} a
 * @return {boolean}
 */
export function isArray(a) {
  return Array.isArray(a);
}

/**
 * @param {*} fn
 * @return {boolean}
 */
export function isFunction(fn) {
  return typeof fn === 'function';
}

/**
 * @param {*} str
 * @return {boolean}
 */
export function isString(str) {
  return typeof str === 'string';
}

/**
 * Iterates through all the object values
 * @param {object} o
 * @param {function} fn
 */
export function forEach(o, fn) {
  Object.entries(o).forEach(([k, v]) => fn(v, k));
}

/**
 * Return the size of an object or array.
 * @param {object|array} o
 * @return {*|number}
 */
export function size(o) {
  return isArray(o) ? o.length : keys(o).length;
}

/**
 * Map values of an object to its keys.
 * @param {object} o
 * @param {function|string} fn
 * @return {object}
 */
export function mapValues(o, fn) {
  if (typeof fn === 'string') {
    fn = (v) => v[fn];
  }
  return Object.fromEntries(
    Object.entries(o).map(([k, v], i) => [i, fn(v, k)])
  );
}

/**
 * Map an object without preserving the keys.
 * @param {object} o
 * @param {function|string} fn
 * @return {array}
 */
export function map(o, fn) {
  return Object.values(mapValues(o, fn));
}

/**
 * Reduce an object using its properties as keys.
 * @param {object} o
 * @param {function} fn
 * @param {*} initial
 * @return {*}
 */
export function reduce(o, fn, initial) {
  return Object.entries(o).reduce(
    (prev, [i, curr]) => fn(prev, curr, i),
    initial
  );
}

/**
 * @param {object} o
 * @return {string[]}
 */
export function keys(o) {
  return Object.keys(o);
}

/**
 * Return the first object that match.
 * @param {object} o
 * @param {object} where
 * @return {*}
 */
export function find(o, where) {
  const w = Object.entries(where);
  return Object.values(o)
    .filter((e) => w === w.filter((k, v) => e[k] === e[v]))
    .shift();
}

/**
 * @param {object} object
 * @param {string} key
 * @return {boolean|*}
 */
export function has(object, key) {
  return object != null && Object.prototype.hasOwnProperty.call(object, key);
}

/**
 * @param {array} array
 * @return {*}
 */
export function first(array) {
  return array != null && array.length ? array[0] : undefined;
}

/**
 * @name throw_if
 * @function
 * @param {Boolean} bool
 * @param {string} message
 */
export function throw_if(condition, message) {
  if (Boolean(condition)) {
    throw message;
  }
}

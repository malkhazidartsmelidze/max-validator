/**
 * Throws given exception by condition
 *
 * condition can be of any type
 * if `Boolean(condition)` resolves to true, then exception will be throw
 * @throws {Exception}
 *
 * @example
 * // Does not throw an exception
 * throw_if(false, 'ex');
 * throw_if(null, 'ex');
 * throw_if(0, 'ex');
 * ...
 *
 * // will throw an exception
 * throw_if(true, 'ex');
 * throw_if(1, 'ex');
 * throw_if('some string', 'ex');
 * throw_if([], 'ex');
 * throw_if({}, 'ex');
 * ...
 */
function throw_if(condition: any, message: string): void {
  if (Boolean(condition)) {
    throw message;
  }
}

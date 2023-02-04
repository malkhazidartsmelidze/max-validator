import { throw_if } from '../utils';
import * as validation_methods from './methods';
import * as config from '../config';

/**
 * get validation method by rule name
 * if validation method doesn't exists throw error
 *
 * @throws {Exception}
 */
export function getValidationMethod(name): Function {
  throw_if(
    validation_methods.hasOwnProperty(name) === false,
    `The validation method "${name}" does not exist`
  );

  return validation_methods[name];
}

/**
 * Extends `Validator` by adding new validation methods.
 *
 * @param {string} name
 * @param {function} method
 * @param {string|null} message
 */
export function extend(name, method, message = null) {
  throw_if(
    typeof method !== 'function',
    'The validation method must be a function'
  );

  // set method as new validator
  setValidationMethod(name, method);

  // if message is passed, merged validator
  if (message) {
    config.setMessage(name, message);
  }
}

/**
 * Set new validation method
 *
 * @example
 * setValidationMethod('rule_name', () => true)
 */
function setValidationMethod(name: string, validator: Function): void {
  validation_methods[name] = validator;
}

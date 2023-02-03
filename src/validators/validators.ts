import { throw_if } from '../utils';
import * as validation_methods from './methods';

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

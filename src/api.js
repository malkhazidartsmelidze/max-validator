import {
  first,
  forEach,
  has,
  isArray,
  isFunction,
  isPlainObject,
  isString,
  size,
} from 'lodash-es';
import { messages, formatMessage } from './messages';
import { methods } from './methods';
import { parseScheme } from './scheme';

export { setMessages, setDefaultMessage } from './messages';
export {
  setRuleSeparator,
  setRuleParamSeparator,
  setParamsSeparator,
} from './scheme';

/**
 * Extends `Validator` by adding new validation methods.
 *
 * @param {string} name
 * @param {function} method
 * @param {string|null} message
 */
export function extend(name, method, message = null) {
  if (has(methods, name)) {
    throw `The validation method "${name}" already exists`;
  }

  if (!isFunction(method)) {
    throw `The validation method must be a function, type given: ${typeof method}`;
  }

  methods[name] = method;

  if (message) {
    messages[name] = message;
  }
}

/**
 * Validate given data with given rules
 *
 * @param {object} data Data to validate
 * @param {object} scheme Validation scheme
 * @param {function?} callback
 * @returns {object}
 */
export function validate(data, scheme, callback = null) {
  let errors = {};
  let failed = {};

  if (!isPlainObject(data) || !isPlainObject(scheme)) {
    throw 'Both data and scheme must be plain objects';
  }

  let rules = parseScheme(scheme);

  forEach(rules, (checks, propName) => {
    failed[propName] = [];

    forEach(checks, (checkFunction, ruleName) => {
      let result = checkFunction(data[propName]);

      if (result === true) {
        return;
      }

      let err;
      if (isString(result)) {
        err = result;
      } else if (isPlainObject(result)) {
        err = formatMessage(ruleName, { name: propName, ...result });
      }

      if (errors[propName] === undefined) {
        errors[propName] = [err];
      } else {
        if (errors[propName].indexOf(err) === -1) {
          errors[propName].push(err);
        }
      }

      failed[propName].push(ruleName);
    });
  });

  const result = getValidationResult(errors, failed);

  if (isFunction(callback)) {
    callback(result);
  }

  return result;
}

/**
 * Get empty result object (used for placeholder)
 * @return {object}
 */
export function getEmpty() {
  return validate({}, {});
}

/**
 * Get the result object from the `validate()` function.
 * Contains the errors and helpers.
 *
 * @param {object} errors
 * @param {object} failed
 * @returns {object}
 */
function getValidationResult(errors, failed) {
  return {
    /**
     * @type {boolean}
     */
    hasError: size(errors) > 0,

    /**
     * @type {Object}
     */
    errors,

    /**
     * Returns TRUE if the property has an error.
     *
     * @param propName
     * @param ruleName
     * @return {boolean}
     */
    isError(propName, ruleName = null) {
      if (ruleName === undefined) {
        return errors[propName] !== undefined;
      } else {
        return (
          failed[propName] !== undefined &&
          failed[propName].indexOf(ruleName) !== -1
        );
      }
    },

    /**
     * Returns the error messages for a property.
     *
     * @param {string} propName
     * @param {boolean} all
     * @return {string|*}
     */
    getError(propName, all = true) {
      if (!isArray(errors[propName]) || size(errors[propName]) === 0) {
        return '';
      }
      return all ? errors[propName].join(',') : first(errors[propName]);
    },
  };
}

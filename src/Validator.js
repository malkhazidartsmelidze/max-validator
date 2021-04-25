import { forEach, isPlainObject, isString, keys } from 'lodash-es';
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
  if (methods.hasOwnProperty(name)) {
    throw `The validation method "${name}" already exists`;
  }

  if (typeof method !== 'function') {
    throw 'The validation method must be function';
  }

  methods[name] = method;

  if (message) {
    messages[name] = message;
  }
}

/**
 * Format Validation Errors
 * @param {object} errors
 * @param {object} failedRules
 * @returns {object}
 */
function getResultObject(errors, failedRules) {
  return {
    hasError: keys(errors).length > 0,
    errors: errors,
    isError(paramName, ruleName) {
      if (ruleName === undefined) {
        return errors[paramName] !== undefined;
      } else {
        return (
          failedRules[paramName] !== undefined &&
          failedRules[paramName].indexOf(ruleName) !== -1
        );
      }
    },
    getError(paramName, getAll = true) {
      if (!Array.isArray(errors[paramName]) || errors[paramName].length === 0) {
        return '';
      }
      return getAll ? errors[paramName].join(',') : errors[paramName][0];
    },
  };
}

/**
 * Validate given data with given rules
 *
 * @param {object} data Data to validate
 * @param {object} scheme Validation scheme
 * @param {function?} callback
 * @returns {object}
 */
export function validate(data, scheme, callback) {
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

  const result = getResultObject(errors, failed);

  if (typeof callback === 'function') {
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

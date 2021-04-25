import { forEach, isPlainObject } from 'lodash-es';
import { messages, defaultMessage } from './messages';
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
 * Format Validation Messages
 * @param {string} name
 * @param {object|null} params
 * @param {string} ruleName
 * @returns {string}
 */
export function formatMessage(name, params, ruleName) {
  if (typeof params !== 'object') {
    params = {};
  }
  params.name = name;

  if (messages[ruleName] === undefined) {
    return defaultMessage;
  }

  let message = messages[ruleName];

  Object.keys(params).map(function (key) {
    message = message.replace(':' + key, params[key]);
  });

  return message;
}

/**
 * Format Validation Errors
 * @param {object} errors
 * @param {object} failedRules
 * @returns {object}
 */
export function formatErrors(errors, failedRules) {
  return {
    hasError: Object.keys(errors).length > 0,
    errors: errors,
    isError: function (paramName, ruleName) {
      if (ruleName === undefined) {
        return errors[paramName] !== undefined;
      } else {
        return (
          failedRules[paramName] !== undefined &&
          failedRules[paramName].indexOf(ruleName) !== -1
        );
      }
    },
    getError: function (paramName, getAll = true) {
      if (!Array.isArray(errors[paramName]) || errors[paramName].length === 0) {
        return '';
      }
      return getAll ? errors[paramName].join(',') : errors[paramName][0];
    },
  };
}

/**
 * Get empty Validator
 * @return {object}
 */
export function getEmpty() {
  return validate({}, {});
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
      if (typeof result === 'string') {
        err = result;
      } else {
        err = formatMessage(propName, result, ruleName);
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

  const errorHandler = formatErrors(errors, failed);

  if (typeof callback === 'function') {
    callback(errorHandler);
  }

  return errorHandler;
}

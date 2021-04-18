import { messages, defaultMessage, setMessages } from './messages';
import { methods as validators } from './methods';
import { parseScheme } from './Rule';

export { setMessages, setDefaultMessage } from './messages';
export {
  setRuleSeparator,
  setRuleParamSeparator,
  setParamsSeparator,
} from './Rule';

/**
 * Extend validation Rule
 * @param {string} ruleName
 * @param {function} validator
 * @param {string|null} message
 * @returns {Validator}
 */
export function extend(ruleName, validator, message = null) {
  if (validators[ruleName] !== undefined) {
    throw 'Validator named ' + ruleName + ' already exists';
  }

  if (typeof validator !== 'function') {
    throw 'Validator must be function';
  }

  validators[ruleName] = validator;

  if (message !== null) {
    setMessages({ [ruleName]: message });
  }

  return this;
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
  let failedRules = {};

  if (typeof data !== 'object' || typeof scheme !== 'object') {
    throw 'Both data and scheme must be object';
  }

  let rules = parseScheme(scheme);

  for (let paramName in rules) {
    failedRules[paramName] = [];

    for (let i = 0, l = rules[paramName].rules.length; i < l; i++) {
      let rule = rules[paramName].rules[i];
      let result = rule.validate(rules[paramName], data[paramName], data);
      let ruleName = result.rule ? result.rule : rule.name;

      if (result === true) {
        continue;
      }

      let err;
      if (typeof result == 'string') {
        err = result;
      } else {
        err = formatMessage(paramName, result, ruleName);
      }

      if (errors[paramName] === undefined) {
        errors[paramName] = [err];
      } else {
        if (errors[paramName].indexOf(err) === -1) {
          errors[paramName].push(err);
        }
      }

      failedRules[paramName].push(ruleName);
    }
  }

  const errorHandler = formatErrors(errors, failedRules);

  if (typeof callback == 'function') {
    callback(errorHandler);
  }

  return errorHandler;
}

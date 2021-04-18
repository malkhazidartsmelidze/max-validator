import defaultMessages from './messages';
import _validators from './validators';

class Validator {
  validators = _validators;
  messages = defaultMessages;
  ruleSeparator = '|';
  ruleParamSeparator = ':';
  paramsSeparator = ',';
  defaultMessage = 'Incorrect Value';

  /**
   * Override default messages with custom messages
   * @param {object} messages
   * @returns {Validator}
   */
  setMessages(messages) {
    if (typeof messages !== 'object') {
      throw 'Messages must be object';
    }

    this.messages = Object.assign(this.messages, messages);

    return this;
  }

  /**
   * Set Default Message of invalid parameter
   * @param {string} msg
   * @returns {Validator}
   */
  setDefaultMessage(msg) {
    if (typeof msg !== 'object') {
      throw 'Messages must be object';
    }

    this.defaultMessage = msg;

    return this;
  }

  /**
   * Override default rule separator
   * @param {string} separator new separator
   * @returns {Validator}
   */
  setRuleSeparator(separator) {
    if (typeof separator !== 'string') throw 'Separator must be string';

    this.ruleSeparator = separator;

    return this;
  }

  /**
   * Override default rule-params separator
   * @param {string} separator new separator
   * @returns {Validator}
   */
  setRuleParamSeparator(separator) {
    if (typeof separator !== 'string') throw 'Separator must be string';

    this.ruleParamSeparator = separator;

    return this;
  }

  /**
   * Override default params separator
   * @param {string} separator new separator
   * @returns {Validator}
   */
  setParamsSeparator(separator) {
    if (typeof separator !== 'string') throw 'Separator must be string';

    this.paramsSeparator = separator;

    return this;
  }

  /**
   * Extend validation Rule
   * @param {string} ruleName Rule Name to validate
   * @param {function} validator Custom function for validation
   * @param {string|null} message
   * @returns {Rule}
   */
  extend(ruleName, validator, message = null) {
    if (this.validators[ruleName] !== undefined) {
      throw 'Validator named ' + ruleName + ' already exists';
    }

    if (typeof validator !== 'function') {
      throw 'Validator must be function';
    }

    this.validators[ruleName] = validator;

    if (message !== null) {
      this.setMessages({
        [ruleName]: message,
      });
    }

    return this;
  }

  /**
   * Extend validation Rule
   * @param {string} ruleName Rule Name to validate
   * @param {function} validator Custom function for validation
   * @returns {Rule}
   */
  getValidator(name) {
    if (typeof this.validators[name] !== 'function') {
      throw 'Validator for ' + name + ' does not exists';
    }

    return this.validators[name];
  }

  /**
   * Check if validation rule exists
   * @param {string} ruleName Rule name to check
   * @returns {boolean}
   */
  exists(ruleName) {
    return typeof this.validators[ruleName] === 'function';
  }

  /**
   * Format Validation Messages
   * @param {string} name Name of validated parameter
   * @param {object|null} params Name of parameters of rule
   * @returns {string}
   */
  formatMessage(name, params, ruleName) {
    if (typeof params !== 'object') {
      params = {};
    }
    params.name = name;

    if (this.messages[ruleName] === undefined) {
      return this.defaultMessage;
    }

    var message = this.messages[ruleName];

    Object.keys(params).map(function (key) {
      message = message.replace(':' + key, params[key]);
    });

    return message;
  }

  /**
   * Format Validation Errors
   * @param {object} errors Validation Errors
   * @param {object} failedRules Validation failed rules
   * @returns {string}
   */
  formatErrors(errors, failedRules) {
    return {
      hasError: Object.keys(errors).length > 0,
      errors: errors,
      isError: function (paramName, ruleName) {
        if (ruleName == undefined) {
          return errors[paramName] !== undefined;
        } else {
          return (
            failedRules[paramName] !== undefined &&
            failedRules[paramName].indexOf(ruleName) !== -1
          );
        }
      },
      getError: function (paramName, getAll = true) {
        if (
          !Array.isArray(errors[paramName]) ||
          errors[paramName].length == 0
        ) {
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
  getEmpty() {
    return this.validate({}, {});
  }

  /**
   * Validate given data with given rules
   * @param {object} data Data to validate
   * @param {object} scheme Validation scheme
   * @returns {object}
   */
  validate = function (data, scheme, callback) {
    var Rule = require('./Rule');
    var errors = {};
    var failedRules = {};

    if (typeof data !== 'object' || typeof scheme !== 'object') {
      throw 'Both data and scheme must be object';
    }

    var rules = Rule.parseScheme(scheme);

    for (var paramName in rules) {
      failedRules[paramName] = [];

      for (var i = 0, l = rules[paramName].rules.length; i < l; i++) {
        var rule = rules[paramName].rules[i];
        var result = rule.validate(rules[paramName], data[paramName], data);
        var ruleName = result.rule ? result.rule : rule.name;

        if (result === true) continue;
        if (typeof result == 'string') {
          var err = result;
        } else {
          var err = this.formatMessage(paramName, result, ruleName);
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

    var data = this.formatErrors(errors, failedRules);

    if (typeof callback == 'function') {
      callback(data);
    }

    return data;
  };
}

export default new Validator();

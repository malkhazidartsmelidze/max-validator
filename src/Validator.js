var defaultMessages = require('./messages');
var _validators = require('./validators');

function Validator() {
  this.validators = _validators;
  this.messages = defaultMessages;
  this.ruleSeparator = '|';
  this.ruleParamSeparator = ':';
  this.paramsSeparator = ',';
  this.defaultMessage = 'Incorrect Value';
}

/**
 * Override default messages with custom messages
 * @param {object} messages
 * @returns {Validator}
 */
Validator.prototype.setMessages = function (messages) {
  if (typeof messages !== 'object') {
    throw 'Messages must be object';
  }

  this.messages = Object.assign(this.messages, messages);

  return this;
};

/**
 * Set Default Message of invalid parameter
 * @param {string} message
 * @returns {Validator}
 */
Validator.prototype.setDefaultMessage = function (msg) {
  if (typeof msg !== 'object') {
    throw 'Messages must be object';
  }

  this.defaultMessage = msg;

  return this;
};

/**
 * Override default rule separator
 * @param {string} separator new separator
 * @returns {Validator}
 */
Validator.prototype.setRuleSeparator = function (separator) {
  if (typeof separator !== 'string') throw 'Separator must be string';

  this.ruleSeparator = separator;

  return this;
};

/**
 * Override default rule-params separator
 * @param {string} separator new separator
 * @returns {Validator}
 */
Validator.prototype.setRuleParamSeparator = function (separator) {
  if (typeof separator !== 'string') throw 'Separator must be string';

  this.ruleParamSeparator = separator;

  return this;
};

/**
 * Override default params separator
 * @param {string} separator new separator
 * @returns {Validator}
 */
Validator.prototype.setParamsSeparator = function (separator) {
  if (typeof separator !== 'string') throw 'Separator must be string';

  this.paramsSeparator = separator;

  return this;
};

/**
 * Extend validation Rule
 * @param {string} ruleName Rule Name to validate
 * @param {function} validator Custom function for validation
 * @returns {Rule}
 */
Validator.prototype.extend = function (ruleName, validator, message = null) {
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
};
/**
 * Extend validation Rule
 * @param {string} ruleName Rule Name to validate
 * @param {function} validator Custom function for validation
 * @returns {Rule}
 */
Validator.prototype.getValidator = function (name) {
  if (typeof this.validators[name] !== 'function') {
    throw 'Validator for ' + name + ' does not exists';
  }

  return this.validators[name];
};

/**
 * Check if validation rule exists
 * @param {string} ruleName Rule name to check
 * @returns {boolean}
 */
Validator.prototype.exists = function (ruleName) {
  return typeof this.validators[ruleName] === 'function';
};

/**
 * Format Validation Messages
 * @param {string} name Name of validated parameter
 * @param {object|null} params Name of parameters of rule
 * @returns {string}
 */
Validator.prototype.formatMessage = function (name, params, ruleName) {
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
};

/**
 * Format Validation Errors
 * @param {object} errors Validation Errors
 * @param {object} failedRules Validation failed rules
 * @returns {string}
 */
Validator.prototype.formatErrors = function (errors, failedRules) {
  return {
    hasError: Object.keys(errors).length > 0,
    errors: errors,
    isError: function (paramName, ruleName) {
      if (ruleName == undefined) {
        return errors[paramName] !== undefined;
      } else {
        return (
          failedRules[paramName] !== undefined && failedRules[paramName].indexOf(ruleName) !== -1
        );
      }
    },
    getError: function (paramName, getAll = true) {
      if (!Array.isArray(errors[paramName]) || errors[paramName].length == 0) {
        return '';
      }

      return getAll ? errors[paramName].join(',') : errors[paramName][0];
    },
  };
};

/**
 * Get empty Validator
 * @return {object}
 */
Validator.prototype.getEmpty = function () {
  return this.validate({}, {});
};

/**
 * Validate given data with given rules
 * @param {object} data Data to validate
 * @param {object} scheme Validation scheme
 * @returns {object}
 */
Validator.prototype.validate = function (data, scheme, callback) {
  var Rule = require('./Rule');
  var errors = {};
  var failedRules = {};

  if (typeof data !== 'object' || typeof scheme !== 'object') {
    throw 'Both data and scheme must be object';
  }

  var rules = Rule.parseScheme(scheme);

  for (paramName in rules) {
    failedRules[paramName] = [];

    for (var i = 0, l = rules[paramName].rules.length; i < l; i++) {
      var rule = rules[paramName].rules[i];
      var result = rule.validate(rules[paramName], data[paramName]);
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

module.exports = new Validator();

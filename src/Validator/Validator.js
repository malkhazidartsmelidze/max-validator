var defaultMessages = require('../messages');
var _validators = require('../validators');

function Validator() {
  this.validators = _validators;
  this.messages = defaultMessages;
  this.ruleSeparator = '|';
  this.ruleParamSeparator = ':';
  this.paramsSeparator = ',';
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

  this.messages = { ...defaultMessages, ...messages };

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
Validator.prototype.extend = function (ruleName, validator) {
  if (this.validators[ruleName] !== undefined) {
    throw 'Validator named ' + ruleName + ' already exists';
  }

  if (typeof validator !== 'function') {
    throw 'Validator must be function';
  }

  this.validators[ruleName] = validator;

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
 * Validate given data with given rules
 * @param {object} data Data to validate
 * @param {object} scheme Validation scheme
 * @returns {object}
 */
Validator.prototype.validate = function (data, scheme) {
  var Rule = require('./Rule');
  var hasError = false;
  var errors = {};

  if (typeof data !== 'object' || typeof scheme !== 'object') {
    throw 'Both data and scheme must be object';
  }

  var rules = Rule.parseScheme(scheme);

  for (paramName in rules) {
    for (var i = 0, l = rules[paramName].rules.length; i < l; i++) {
      var r = rules[paramName].rules[i];
      var result = r.validate(rules[paramName], data[paramName]);

      if (result === true) continue;

      if (errors[name] === undefined) {
        errors[name] = [this.formatMessage(r.name)];
      } else {
        errors[name].push();
      }

      hasError = true;
    }
  }
};

module.exports = new Validator();

var Validator = require('./Validator.js');

var dontValidate = ['required', 'string', 'nullable', 'numeric'];

/**
 * New rules
 * @param {string} ruleName Rule name
 */
function Rule(ruleName) {
  this.name = ruleName;
  if (dontValidate.indexOf(ruleName) === -1) {
    this.validator = Validator.getValidator(this.name);
  }
  this.params = [];
}

/**
 * Validate given value
 * @param {any} value
 * @returns {Rule}
 */
Rule.prototype.validate = function (rules, value) {
  if (value == undefined || value == null || value == '') {
    if (rules.isRequired) {
      return {
        rule: 'required',
      };
    } else if (rules.isNullable) {
      return true;
    }
  }

  if (rules.isNumeric) {
    value = parseFloat(value);
  } else if (value.isString) {
    value = String(value);
  }

  return this.validator(value, ...this.params);
};

/**
 * Set Validator function params
 * @param {array} params
 * @returns {Rule}
 */
Rule.prototype.setParams = function (params = []) {
  this.params = params;

  return this;
};

/**
 * Parse scheme of rules
 * @param {object} ruleScheme
 * @returns {object} Parsed rules
 */
Rule.parseScheme = function (ruleScheme) {
  const rules = {};

  for (name in ruleScheme) {
    if (typeof ruleScheme[name] !== 'string') throw 'Validation rules must be string';
    var _rules = Rule.parseRuleSet(ruleScheme[name]);

    var isRequired = _rules.required !== undefined;
    var isString = _rules.string !== undefined;
    var isNumeric = _rules.numeric !== undefined;
    var isNullable = _rules.nullable !== undefined;

    for (var i = 0; i < dontValidate.length; i++) {
      delete _rules[dontValidate[i]];
    }

    rules[name] = {
      rules: Object.values(_rules),
      isRequired: isRequired,
      isString: isString,
      isNumeric: isNumeric,
      isNullable: isNullable,
    };
  }

  return rules;
};

/**
 * Parse ruleset and convert it into Rules object
 * @param {string} ruleSet
 * @return {object} Parsed ruleSet
 */
Rule.parseRuleSet = function (ruleSet) {
  var rules = {};
  var allRules = ruleSet.split(Validator.ruleSeparator);

  allRules.map(function (r) {
    var _ruleParams = r.split(Validator.ruleParamSeparator);
    var _ruleName = _ruleParams[0].trim();
    var rule = new Rule(_ruleName);

    var _params = _ruleParams[1];
    var _function_params = _params !== undefined ? _params.split(Validator.paramsSeparator) : [];
    rule.setParams(_function_params);

    rules[_ruleName] = rule;

    return null;
  });

  return rules;
};

module.exports = Rule;

const Validator = require('./Validator.js');

function Rule(ruleName) {
  this.name = ruleName;
  this.validator = Validator.getValidator(this.name);
  this.params = [];
}

/**
 * Validate given value
 * @param {any} value
 * @returns {Rule}
 */
Rule.prototype.validate = function (rules, value) {
  if (rules.isRequired && (value == undefined || value == null || value == '' || value == 0)) {
    return false;
  }

  return this.validator(rules, value, ...this.params);
};

/**
 * Set Name of rule
 * @param {string} name
 * @returns {Rule}
 */
Rule.prototype.setName = function (name) {
  this.name = name;

  return this;
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

Rule.parseScheme = function (ruleScheme) {
  const rules = {};

  for (name in ruleScheme) {
    if (typeof ruleScheme[name] !== 'string') throw 'Validation rules must be string';
    var _rules = Rule.parseRuleSet(ruleScheme[name]);

    rules[name] = {
      rules: Object.values(_rules),
      isRequired: _rules.required !== undefined,
      isString: _rules.string !== undefined,
      isNumeric: _rules.numeric !== undefined,
      isNullable: _rules.nullable !== undefined,
    };
  }

  return rules;
};

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

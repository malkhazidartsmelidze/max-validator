var Validator = require('./Validator.js');

var dontValidate = ['required', 'string', 'nullable', 'number'];

/**
 * New rules
 * @param {string} rule Rule name
 */
function Rule(rule) {
  if (typeof rule == 'string') {
    this.name = rule;
    this.isInlineFunction = false;

    if (dontValidate.indexOf(rule) === -1) {
      this.validator = Validator.getValidator(this.name);
    }
  } else if (typeof rule == 'function') {
    this.name = rule.name || 'default';
    this.isInlineFunction = true;
    this.validator = rule;
  }

  this.params = [];
}

/**
 * Validate given value
 * @param {any} value
 * @returns {Rule}
 */
Rule.prototype.validate = function (rules, value, data) {
  if (value == undefined || value == null || value == '') {
    if (rules.isRequired) {
      return {
        rule: 'required',
      };
    } else if (rules.isNullable) {
      return true;
    }
  }

  if (rules.isNumber) {
    value = parseFloat(value);
  } else if (rules.isString) {
    value = String(value);
  }

  if (this.isInlineFunction) {
    return this.validator(value, data);
  } else {
    return this.validator(value, ...this.params);
  }
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
    var _ruleSet = ruleScheme[name];
    var _rules = {};

    if (typeof _ruleSet == 'string') {
      _rules = Rule.parseStringRules(_ruleSet);
    } else if (Array.isArray(_ruleSet)) {
      _rules = Rule.parseArrayRules(_ruleSet);
    } else if (typeof _ruleSet == 'object') {
      _rules = Rule.parseRulesObject(_ruleSet);
    } else {
      throw 'Invalid rules for ' + name;
    }

    var isRequired = _rules.required !== undefined;
    var isString = _rules.string !== undefined;
    var isNumber = _rules.number !== undefined;
    var isNullable = _rules.nullable !== undefined;

    for (var i = 0; i < dontValidate.length; i++) {
      delete _rules[dontValidate[i]];
    }

    rules[name] = {
      rules: Object.values(_rules),
      isRequired: isRequired,
      isString: isString,
      isNumber: isNumber,
      isNullable: isNullable,
    };
  }

  return rules;
};

/**
 * If validation rules is array: ['required', 'max:20', someFunction ...]
 * @param {Array} ruleSet
 * @returns {Object}
 */
Rule.parseArrayRules = function (ruleSet) {
  var rules = {};
  var i = 100;
  ruleSet.map(function (rule) {
    if (rule == null || rule == '') return;

    if (typeof rule == 'string') {
      var parsedRule = Rule.parseStringRules(rule);
      Object.assign(rules, parsedRule);
    } else if (typeof rule == 'function') {
      var _ruleName = rule.name.length > 0 ? rule.name : i++;
      var _rule = new Rule(rule);

      rules[_ruleName] = _rule;
    }
  });

  return rules;
};

/**
 * If validation rules is object: {required: true, in_array: [1, 2, 3, 4, 5] ... , custom: function(){}}
 * @param {Array} ruleSet
 * @returns {Object}
 */
Rule.parseRulesObject = function (ruleSet) {
  var rules = {};
  var i = 100;
  Object.keys(ruleSet).map(function (ruleName) {
    var ruleParam = ruleSet[ruleName];

    if (typeof ruleParam == 'function') {
      var _ruleName = ruleParam.name.length > 0 ? ruleParam.name : i++;
      var _rule = new Rule(ruleParam);

      rules[_ruleName] = _rule;
    } else {
      var params = Array.isArray(ruleParam) ? ruleParam : [ruleParam];
      var _rule = new Rule(ruleName).setParams(params);
      rules[ruleName] = _rule;
    }
  });

  return rules;
};

/**
 * Parse String rule set
 * @param {string} ruleSet
 * @return {object} Parsed ruleSet
 */
Rule.parseStringRules = function (ruleSet) {
  var rules = {};
  var allRules = ruleSet.split(Validator.ruleSeparator);

  allRules
    .filter(function (val) {
      return val !== '';
    })
    .map(function (r) {
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

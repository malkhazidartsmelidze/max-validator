import { getValidationMethod as getValidator } from './methods';

const dontValidate = ['required', 'string', 'nullable', 'number'];

export let ruleSeparator = '|';
export let ruleParamSeparator = ':';
export let paramsSeparator = ',';

/**
 * Override default rule separator
 * @param {string} separator
 * @returns {Validator}
 */
export function setRuleSeparator(separator) {
  if (typeof separator !== 'string') {
    throw 'Separator must be string';
  }

  ruleSeparator = separator;
  return this;
}

/**
 * Override default rule-params separator
 * @param {string} separator
 * @returns {Validator}
 */
export function setRuleParamSeparator(separator) {
  if (typeof separator !== 'string') {
    throw 'Separator must be string';
  }

  ruleParamSeparator = separator;
  return this;
}

/**
 * Override default params separator
 * @param {string} separator
 * @returns {Validator}
 */
export function setParamsSeparator(separator) {
  if (typeof separator !== 'string') {
    throw 'Separator must be string';
  }

  paramsSeparator = separator;
  return this;
}

/**
 * New rules
 * @param {string} rule
 */
class Rule {
  constructor(rule) {
    if (typeof rule == 'string') {
      this.name = rule;
      this.isInlineFunction = false;

      if (dontValidate.indexOf(rule) === -1) {
        this.validator = getValidator(this.name);
      }
    } else if (typeof rule == 'function') {
      this.name = rule.name || 'default';
      this.isInlineFunction = true;
      this.validator = rule;
    }

    this.params = [];
  }

  /**
   * @param rules
   * @param value
   * @param data
   * @return {{rule: string}|boolean|*}
   */
  validate(rules, value, data) {
    if (value === undefined || value === null || value === '') {
      if (rules.isRequired) {
        return { rule: 'required' };
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
  }

  /**
   * Set Validator function params
   * @param {array} params
   * @returns {Rule}
   */
  setParams(params = []) {
    this.params = params;
    return this;
  }
}

/**
 * Parse scheme of rules
 * @param {object} ruleScheme
 * @returns {object} Parsed rules
 */
export function parseScheme(ruleScheme) {
  const rules = {};

  for (var name in ruleScheme) {
    var _ruleSet = ruleScheme[name];
    var _rules = {};

    if (typeof _ruleSet == 'string') {
      _rules = parseStringRules(_ruleSet);
    } else if (Array.isArray(_ruleSet)) {
      _rules = parseArrayRules(_ruleSet);
    } else if (typeof _ruleSet == 'object') {
      _rules = parseRulesObject(_ruleSet);
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
}

/**
 * If validation rules is array: ['required', 'max:20', someFunction ...]
 * @param {Array} ruleSet
 * @returns {Object}
 */
export function parseArrayRules(ruleSet) {
  var rules = {};
  var i = 100;
  ruleSet.map(function (rule) {
    if (rule == null || rule === '') return;

    if (typeof rule == 'string') {
      var parsedRule = parseStringRules(rule);
      Object.assign(rules, parsedRule);
    } else if (typeof rule == 'function') {
      var _ruleName = rule.name.length > 0 ? rule.name : i++;
      var _rule = new Rule(rule);

      rules[_ruleName] = _rule;
    }
  });

  return rules;
}

/**
 * If validation rules is object: {required: true, in_array: [1, 2, 3, 4, 5] ... , custom: function(){}}
 * @param {Array} ruleSet
 * @returns {Object}
 */
export function parseRulesObject(ruleSet) {
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
}

/**
 * Parse String rule set
 * @param {string} ruleSet
 * @return {object} Parsed ruleSet
 */
export function parseStringRules(ruleSet) {
  var rules = {};
  var allRules = ruleSet.split(ruleSeparator);

  allRules
    .filter(function (val) {
      return val !== '';
    })
    .map(function (r) {
      var _ruleParams = r.split(ruleParamSeparator);
      var _ruleName = _ruleParams[0].trim();
      var rule = new Rule(_ruleName);

      var _params = _ruleParams[1];
      var _function_params =
        _params !== undefined ? _params.split(paramsSeparator) : [];
      rule.setParams(_function_params);

      rules[_ruleName] = rule;
    });

  return rules;
}

export default Rule;

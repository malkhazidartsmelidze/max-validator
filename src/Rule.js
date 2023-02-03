import { getValidationMethod as getValidator } from './methods';
import * as config from './config';

const dontValidate = ['required', 'string', 'nullable', 'number'];

/**
 * @class Rule
 * @param {string} rule
 */
export default class Rule {
  /**
   * @param {string|function} rule
   */
  constructor(rule) {
    if (typeof rule === 'string') {
      this.name = rule;
      this.isInlineFunction = false;
      if (dontValidate.indexOf(rule) === -1) {
        this.validator = getValidator(this.name);
      }
    } else if (typeof rule === 'function') {
      this.name = rule.name || 'default';
      this.isInlineFunction = true;
      this.validator = rule;
    }

    this.params = [];
  }

  /**
   * @param {{}} rules
   * @param {*} value
   * @param {{}} data
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
   * @param {array} params
   * @return {Rule}
   */
  setParams(params = []) {
    this.params = params;
    return this;
  }
}

/**
 * Parse a complete scheme of rules.
 * Can contains arrays, objects and strings.
 *
 * @param {{}} ruleScheme
 * @return {{}} Parsed rules
 */
export function parseScheme(ruleScheme) {
  const rules = {};

  for (let name in ruleScheme) {
    let _ruleSet = ruleScheme[name];
    let _rules = {};

    if (typeof _ruleSet === 'string') {
      _rules = parseStringRules(_ruleSet);
    } else if (Array.isArray(_ruleSet)) {
      _rules = parseArrayRules(_ruleSet);
    } else if (typeof _ruleSet === 'object') {
      _rules = parseObjectRules(_ruleSet);
    } else {
      throw `Invalid rules for ${name}`;
    }

    let isRequired = _rules['required'] !== undefined;
    let isString = _rules['string'] !== undefined;
    let isNumber = _rules['number'] !== undefined;
    let isNullable = _rules['nullable'] !== undefined;

    for (let i = 0; i < dontValidate.length; i++) {
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
 * @example ['required', 'max:20', someFunction ...]
 * @param {array} ruleSet
 * @return {object}
 */
function parseArrayRules(ruleSet) {
  let rules = {};
  let i = 100;
  ruleSet.map(function (rule) {
    if (rule == null || rule === '') return;

    if (typeof rule === 'string') {
      let parsedRule = parseStringRules(rule);
      Object.assign(rules, parsedRule);
    } else if (typeof rule === 'function') {
      let _ruleName = rule.name.length > 0 ? rule.name : i++;
      rules[_ruleName] = new Rule(rule);
    }
  });

  return rules;
}

/**
 * @example {required: true, in_array: [1, 2, 3, 4, 5] ... , custom: function(){}}
 * @param {object} ruleSet
 * @return {object}
 */
function parseObjectRules(ruleSet) {
  let rules = {};
  let i = 100;
  Object.keys(ruleSet).map(function (ruleName) {
    let ruleParam = ruleSet[ruleName];

    if (typeof ruleParam === 'function') {
      let _ruleName = ruleParam.name.length > 0 ? ruleParam.name : i++;
      rules[_ruleName] = new Rule(ruleParam);
    } else {
      let params = Array.isArray(ruleParam) ? ruleParam : [ruleParam];
      rules[ruleName] = new Rule(ruleName).setParams(params);
    }
  });

  return rules;
}

/**
 * @param {string} ruleSet
 * @return {object}
 */
function parseStringRules(ruleSet) {
  let rules = {};
  let allRules = ruleSet.split(config.ruleSeparator);

  allRules
    .filter(function (val) {
      return val !== '';
    })
    .map(function (r) {
      let _ruleParams = r.split(config.ruleParamSeparator);
      let _ruleName = _ruleParams[0].trim();
      let rule = new Rule(_ruleName);

      let _params = _ruleParams[1];
      let _function_params =
        _params !== undefined ? _params.split(config.paramsSeparator) : [];
      rule.setParams(_function_params);
      rules[_ruleName] = rule;
    });

  return rules;
}

/**
 * @deprecated will be removed in 2.0, use `V.config.setRuleSeparator` instead
 * @function
 */
const new_setRuleSeparator = config.setRuleSeparator;
/**
 * @deprecated will be removed in 2.0, use `V.config.setRuleParamSeparator` instead
 * @function
 */
const new_setRuleParamSeparator = config.setRuleParamSeparator;
/**
 * @deprecated will be removed in 2.0, use `V.config.setParamsSeparator` instead
 * @function
 */
const new_setParamsSeparator = config.setParamsSeparator;

/**
 * @deprecated will be removed in 2.0, use `V.config.ruleSeparator` instead
 */
const ruleSeparator = config.ruleSeparator;

/**
 * @deprecated will be removed in 2.0, use `V.config.ruleParamSeparator` instead
 */
const ruleParamSeparator = config.ruleParamSeparator;

/**
 * @deprecated will be removed in 2.0, use `V.config.paramsSeparator` instead
 */
const paramsSeparator = config.paramsSeparator;

export {
  ruleSeparator,
  ruleParamSeparator,
  paramsSeparator,
  new_setRuleSeparator as setRuleSeparator,
  new_setRuleParamSeparator as setRuleParamSeparator,
  new_setParamsSeparator as setParamsSeparator,
};

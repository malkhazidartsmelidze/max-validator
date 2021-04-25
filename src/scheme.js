import {
  assign,
  forEach,
  isArray,
  isFunction,
  isPlainObject,
  isString,
  mapValues,
} from 'lodash-es';
import { getRuleFunction } from './rules';

export let ruleSeparator = '|';
export let ruleParamSeparator = ':';
export let paramsSeparator = ',';

/**
 * Override default rule separator
 * @param {string} separator
 */
export function setRuleSeparator(separator) {
  if (isString(separator)) {
    throw 'Separator must be string';
  }
  ruleSeparator = separator;
}

/**
 * Override default rule-params separator
 * @param {string} separator
 */
export function setRuleParamSeparator(separator) {
  if (isString(separator)) {
    throw 'Separator must be string';
  }
  ruleParamSeparator = separator;
}

/**
 * Override default params separator
 * @param {string} separator
 */
export function setParamsSeparator(separator) {
  if (isString(separator)) {
    throw 'Separator must be string';
  }
  paramsSeparator = separator;
}

/**
 * Parse a complete scheme of rules.
 * Can contains arrays, objects and strings.
 *
 * @param {{}} scheme
 * @return {{}} Parsed rules
 */
export function parseScheme(scheme) {
  return mapValues(scheme, (config, propName) => {
    if (isString(config)) {
      return parseStringRules(config);
    }

    if (isArray(config)) {
      return parseArrayRules(config);
    }

    if (isPlainObject(config)) {
      return parseObjectRules(config);
    }

    throw `Invalid rules for ${propName}`;
  });
}

/**
 * Parse an array of rules.
 * Can contain string or functions.
 *
 * @example ['required', 'max:20', fn() => {}]
 *
 * @param {array} config
 * @return {object}
 */
function parseArrayRules(config) {
  const rules = {};
  let i = 0;

  forEach(config, (rule) => {
    if (isString(rule)) {
      assign(rules, parseStringRules(rule));
    } else if (isFunction(rule)) {
      rules[`anonymous_${i++}`] = rule;
    } else {
      throw `Couldn't parse the scheme, unsupported rule type: ${typeof rule}`;
    }
  });

  return rules;
}

/**
 * @example {required: true, in_array: [1, 2, 3, 4, 5] ... , fn() => {}}
 * @param {object} config
 * @return {object}
 */
function parseObjectRules(config) {
  const rules = {};

  forEach(config, (option, name) => {
    if (isFunction(option)) {
      rules[name] = (value) => option(value);
    } else {
      const args = isArray(option) ? option : [option];
      const fn = getRuleFunction(name);
      rules[name] = (value) => fn(value, ...args);
    }
  });

  return rules;
}

/**
 * @param {string} config
 * @return {object}
 */
function parseStringRules(config) {
  const defs = config.split(ruleSeparator).filter((v) => v);
  const rules = {};

  forEach(defs, (data) => {
    const parts = data.split(ruleParamSeparator);
    const name = parts[0].trim();
    const fn = getRuleFunction(name);
    const args = isString(parts[1]) ? parts[1].split(paramsSeparator) : [];
    rules[name] = (value) => fn(value, ...args);
  });

  return rules;
}

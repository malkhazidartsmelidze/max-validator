import { mapValues } from 'lodash-es';
import { getValidationMethod } from './methods';

export let ruleSeparator = '|';
export let ruleParamSeparator = ':';
export let paramsSeparator = ',';

/**
 * Override default rule separator
 * @param {string} separator
 */
export function setRuleSeparator(separator) {
  if (typeof separator !== 'string') {
    throw 'Separator must be string';
  }
  ruleSeparator = separator;
}

/**
 * Override default rule-params separator
 * @param {string} separator
 */
export function setRuleParamSeparator(separator) {
  if (typeof separator !== 'string') {
    throw 'Separator must be string';
  }
  ruleParamSeparator = separator;
}

/**
 * Override default params separator
 * @param {string} separator
 */
export function setParamsSeparator(separator) {
  if (typeof separator !== 'string') {
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
    if (typeof config === 'string') {
      return parseStringRules(config);
    }

    if (Array.isArray(config)) {
      return parseArrayRules(config);
    }

    if (typeof config === 'object') {
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

  config.forEach((rule) => {
    if (typeof rule === 'string') {
      Object.assign(rules, parseStringRules(rule));
    } else if (typeof rule === 'function') {
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

  Object.entries(config).forEach(([name, option]) => {
    if (typeof option === 'function') {
      rules[name] = (value) => option(value);
    } else {
      const params = Array.isArray(option) ? option : [option];
      const method = getValidationMethod(name);
      rules[name] = (value) => method(value, params);
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

  for (const data of defs) {
    const parts = data.split(ruleParamSeparator);
    const name = parts[0].trim();
    const method = getValidationMethod(name);
    const args = parts[1] !== undefined ? parts[1].split(paramsSeparator) : [];
    rules[name] = (value) => method(value, ...args);
  }

  return rules;
}

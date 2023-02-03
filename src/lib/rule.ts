import { messages, splitters } from '../config';
import { getMessage } from '../config/messages';
import { throw_if } from '../utils';

/**
 * Rulesets are set of individual rules, no matter it is string, object or other type
 *
 * Rules can be simple or with parameters and some data passed on it
 *
 * Simple rules example: `"number"` , `"email"` , '"alpha"` ...
 *
 * Complexed rules can be: `"max:50"`, `"between:50,100"` ...
 */
export type Rule = string | Function;

export type ParsedRule = {
  validator: Function;
  message: string | null;
  params: Array<any> | null;
  type?: null | 'inline_func' | 'object' | 'rule';
  required?: boolean;
  string?: boolean;
  nullable?: boolean;
  number?: boolean;
  onError?: Function;
  onSuccess?: Function;
};

/**
 * Rules that are type hints and doesn't need to validate
 * These rules are resolved before data is passed to validator for validation
 */
const simple_rules: Array<string> = [
  'required',
  'string',
  'nullable',
  'number',
];

/**
 * Parse single rule in ruleset given as string, function or object
 *
 * If second argument, params is given that means that Ruleset must be an object
 * so rule is rule name and params is rule params
 */
export function parse_rule(rule: Rule | string, params = null): ParsedRule {
  // If rule is string, then it's parsed by given value
  if (typeof rule === 'string') {
    return parse_string_rule(rule as string);
  }

  // If rule is function
  if (typeof rule === 'function') {
    return parse_function_rule(rule);
  }

  // If rule is object
  if (typeof rule === 'object') {
    return parse_object_rule(rule);
  }
}

/**
 * If individual rule is a string
 */
function parse_string_rule(rule: string): ParsedRule {
  // Create new parsedRule
  let splitted_params = null;

  // Split rule into params and rule_name
  // "max:50" => ["max", "50"]
  // "between:5,10" => ["between", "5,10"]
  // "email" => ["email"]
  let [rule_name, params] = rule.split(splitters.ruleParamSplitter);

  // if params is passed
  if (params && params.length > 0) {
    // params is passed, then split params into values
    // "5,10" => ["5", "10"]
    // "5" => "5"
    splitted_params = params
      .split(splitters.paramsSplitter)
      .filter((val) => val);
  }

  return create_rule_from_params(rule_name, params);
}

/**
 * This function finds rule and its params and creates ParsedRule of that parameters
 */
export function create_rule_from_params(
  rule_name: string,
  params: any
): ParsedRule {
  let parsed_rule = {
    type: 'rule',
  } as ParsedRule;

  // @todo refactor
  parsed_rule.validator = () => rule_name;

  // If params is passed as array
  // Then add params to ParsedRule
  if (Array.isArray(params)) {
    parsed_rule.params = params as Array<any>;
  }

  // If params is function that means that this type of ruleset is passed
  // {some_custom_rule: () => true }
  else if (typeof params === 'function') {
    parsed_rule.validator = params;
  }

  // if found simple_rule declaration then this sets in the ruleset
  // if data is required, nullable, number, string or anything
  if (simple_rules.indexOf(rule_name) !== -1) {
    parsed_rule[rule_name] = true;
  }

  // set message for given rule_name
  parsed_rule.message = getMessage(rule_name);

  return parsed_rule;
}

/**
 * This is called for rule parseing, when inline/custom function is passed to validate data
 * for example:
 * ["required", "min:5" () => {
 *  // Some custom code here
 * }]
 */
export function parse_function_rule(
  rule: Function,
  rule_name?: string
): ParsedRule {
  // Get rule message if given rule name
  let message = null;
  if (rule_name) {
    message = getMessage(rule_name);
  }

  return {
    // set type as inline function
    type: 'inline_func',
    // set this function as validator
    validator: rule,
    message: message,
    params: null,
  };
}

/**
 * This is called when object is passed as a validator
 * for example:
 * ["required", "min:5", {
 *  validator: some_custom_function,
 *  message: 'Some custom error message',
 *  onError: some_error_trigger_function,
 *  onSuccess: some_success_tirgger_function,
 *  params: [5,10]
 * }]
 */
function parse_object_rule(rule: ParsedRule): ParsedRule {
  throw_if(
    typeof rule.validator !== 'function',
    'Passed rule must be a function'
  );

  // Create parsed rule from given rule
  let parsed_rule = {
    ...rule,
    // set type as inline function
    type: 'object',
    // set this function as validator
    validator: rule.validator,
  } as ParsedRule;

  // If message is passed, then pass this message to parsed rule
  if (typeof rule.message === 'string') {
    parsed_rule.message = rule.message;
  }

  return parsed_rule;
}

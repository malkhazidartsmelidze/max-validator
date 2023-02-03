import { splitters } from '../config';
import { throw_if } from '../utils';
import {
  create_rule_from_params,
  ParsedRule,
  parse_function_rule,
  parse_rule,
  Rule,
} from './rule';

/**
 * Given rules for each data can be following
 *
 * @example
 * // pass as a string type
 * age: "required|number|min:5|max:100"
 * // pass as an array
 * name: ["required", "string", "min:1", "max:55"]
 * // pass object
 * gender: {
 *    required: true,
 *    in: ["male", "female"]
 * }
 */

type StringRuleSet = string;
type ArrayRuleSet = Array<string | Function | Object>;
type ObjectRuleSet = Record<AllRules, any>;

export type ValidationRuleSet = StringRuleSet | ObjectRuleSet | ArrayRuleSet;

export function parse_ruleset(ruleset: ValidationRuleSet): Array<ParsedRule> {
  // If ruleset is passed as a string
  // for example "required|number|min:5|max:100"
  // then parsing a string is called
  if (typeof ruleset === 'string') {
    return parse_string_ruleset(ruleset as StringRuleSet);
  }

  // If rules passed as an array
  // for example ["required", "string", "min:1", "max:55"]
  if (Array.isArray(ruleset)) {
    return parse_array_ruleset(ruleset);
  }

  // If ruleset is passed as an object
  // Then object parsing is called
  // @todo better validation of object rules
  if (typeof ruleset === 'object') {
    return parse_object_ruleset(ruleset);
  }

  throw_if(true, 'Invalid ruleset passed');
}

/**
 * Called when validation rules is called
 * at first, this splits rules and makes it an array and then
 * parses that string as an array
 */
function parse_string_ruleset(ruleset: StringRuleSet): Array<ParsedRule> {
  // Split rules by splitter separator set in config
  // "required|number|min:5|max:100" => ['required', 'number', 'min:5', 'max:100']
  let splitted_rules = ruleset.split(splitters.ruleSplitter);

  return parse_array_ruleset(splitted_rules);
}

/**
 * Called when ruleset is passed as an array
 * @example
 * ["required","string", "min:5", () => {}, {} ...]
 */
function parse_array_ruleset(ruleset: ArrayRuleSet): Array<ParsedRule> {
  let parsed_rules: Array<ParsedRule> = [];

  // At first, we have to filter empty rules and incorrect values
  ruleset
    .filter((rule) => rule)
    .map((rule) => {
      // Parse rule and append to parse rules
      parsed_rules.push(parse_rule(rule as Rule));
    });

  return parsed_rules;
}

/**
 * Parse ruleset when passed as object
 *
 * @example
 * {
 *  required: true,
 *  string: true,
 *  between: [5, 100]
 *  custom_rule: () => {}
 *    ...
 *  }
 */
function parse_object_ruleset(ruleset: ObjectRuleSet): Array<ParsedRule> {
  let parsed_rules: Array<ParsedRule> = [];

  // For each key in object
  for (let rule_name in ruleset) {
    const rule = ruleset[rule_name];

    // if object value is function
    if (typeof rule === 'function') {
      parsed_rules.push(parse_function_rule(rule, rule_name));
    } else {
      parsed_rules.push(create_rule_from_params(rule, ruleset[rule_name]));
    }
  }

  return parsed_rules;
}

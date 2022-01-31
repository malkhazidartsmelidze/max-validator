import { parse_ruleset, ValidationRuleSet } from './ruleset';

/**
 * Validation scheme must be an object where key must be a string or number
 * and value must be set of rules
 * @see {ValidationRules}
 *
 * @example
 * {
 *   // pass as a string type
 *   age: "required|number|min:5|max:100"
 *   // pass as an array
 *   name: ["required", "string", "min:1", "max:55"]
 *   // pass object
 *   gender: {
 *      required: true,
 *      in: ["male", "female"]
 *   }
 * }
 */
type ValidationScheme = Record<string | number, ValidationRuleSet>;

export function parse_scheme(scheme: ValidationScheme): Object {
  // Create an empty set of rules
  const set_of_rules = {};

  // Iterate through all keys of validation scheme
  // And parse its rules
  for (let data_name in scheme) {
    set_of_rules[data_name] = parse_ruleset(scheme[data_name]);
  }

  return set_of_rules;
}

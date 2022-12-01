/**
 * @todo:
 * 1. Move defaultMessage in messages.default
 * 2. Move separators in single object
 */

/**
 * @type {string}
 */
export let ruleSeparator = '|';

/**
 * @type {string}
 */
export let ruleParamSeparator = ':';

/**
 * @type {string}
 */
export let paramsSeparator = ',';

/**
 * @type {string}
 */
export let defaultMessage = 'Incorrect Value';

/**
 * @type {*}
 */
export let messages = {
  required: ':name is required',
  min: ':name cant be less than :min',
  max: ':name cant be greater than :max',
  between: ':name must be between :from and :to',
  checked: ':name must be checked',
  array: ':name must be array',
  object: ':name must be object',
  boolean: ':name must be boolean',
  numeric: ':name can only contain digits',
  alpha_numeric: ':name can only contain digits and letters',
  alpha_dash: ':name can only contain letters and dashes',
  alpha: ':name can only contain leters',
  email: ':name must be correct mail',
  phone: ':name must be a correct phone number',
  in_array: ':name is invalid',
  not_in: ":name can't be :value",
  json: ':name must be valid json',
  ip: ':name must be valid ip adress',
  url: ':name must be valid url',
  equals: ':name must equal to :value',
  not_equals: ":name can't be :value",
  contains_one: ':name must contain ":value_to_contain"',
  contains_all: ':name must contain ":value_to_contain"',
  starts_with: ':name must start with :prefix',
  ends_with: ':name must end with :suffix',
  date: ':name must valid date',
};

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
 * Override multiple messages at once
 *
 * @param {object} newMessages
 */
export function setMessages(newMessages) {
  if (typeof newMessages !== 'object') {
    throw 'Messages must be object';
  }

  messages = { ...messages, ...newMessages };
}

/**
 * Set rule message
 *
 * @param {string} rule
 * @param {string} message
 */
export function setMessage(rule, message) {
  if (typeof rule !== 'string' || typeof message !== 'string') {
    throw_if();
  }
}

/**
 * Override default message
 *
 * @param {string} msg
 */
export function setDefaultMessage(msg) {
  if (typeof msg !== 'string') {
    throw 'Default message must be a string';
  }

  defaultMessage = msg;
}

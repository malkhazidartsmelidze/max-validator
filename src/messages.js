import { has, isPlainObject, isString, reduce } from './util';

/**
 * @type {string}
 */
export let defaultMessage = 'Incorrect Value';

/**
 * @type {*}
 */
export let messages = {
  required: ':name is required',
  min: ":name can't be less than :min",
  max: ":name can't be greater than :max",
  between: ':name must be between :from and :to',
  checked: ':name must be checked',
  array: ':name must be an array',
  object: ':name must be an object',
  boolean: ':name must be a boolean',
  numeric: ':name can only contain digits',
  alpha_numeric: ':name can only contain digits and letters',
  alpha_dash: ':name can only contain letters and dashes',
  alpha: ':name can only contain letters',
  email: ':name must be a valid email',
  phone: ':name must be a correct phone number',
  in_array: ':name is not in :value',
  not_in: ":name can't be :value",
  json: ':name must be valid json',
  ip: ':name must be valid ip address',
  url: ':name must be valid url',
  equals: ':name must equal to :value',
  not_equals: ":name can't be :value",
  contains_one: ':name must contain one of ":value_to_contain"',
  contains_all: ':name must contain all of ":value_to_contain"',
  string: ':name must be a string',
  starts_with: ':name must start with :prefix',
  ends_with: ':name must end with :suffix',
  date: ':name must be a valid date',
};

/**
 * @param {object} m
 */
export function setMessages(m) {
  if (!isPlainObject(m)) {
    throw 'The messages must be an object';
  }
  Object.assign(messages, m);
}

/**
 * @param {string} m
 */
export function setDefaultMessage(m) {
  if (!isString(m)) {
    throw 'The default message must be a string';
  }
  defaultMessage = m;
}

/**
 * Format the validation messages.
 *
 * @param {string} name
 * @param {object} params
 * @returns {string}
 */
export function formatMessage(name, params = {}) {
  if (has(messages, name)) {
    // Replaces all the ":key" parts with its value
    return reduce(params, (m, v, k) => m.replace(`:${k}`, v), messages[name]);
  }
  return defaultMessage;
}

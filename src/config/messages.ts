type Messages = Record<string, string>;

export let defaultMessage: string = 'Incorrect Value';

export let messages: Messages = {
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
 * Override Or add multiple messages at once
 *
 * @throws {Exception}
 *
 * @example
 * setMessages({
 *  date: 'new error message for date',
 *  number: 'new error message for number',
 * })
 */
export function setMessages(newMessages: Messages): void {
  throw_if(typeof newMessages !== 'object', 'Messages must be object');

  /**
   * Loop over new messages and change one by one
   */
  for (let rule in newMessages) {
    setMessage(rule, newMessages[rule]);
  }
}

/**
 * Set single rule message
 *
 * @throws {Exception}
 *
 * @example
 * setMessage('number', 'new error message for number')
 */
export function setMessage(rule: string, message: string): void {
  throw_if(typeof rule !== 'string', 'Invalid rule name');
  throw_if(typeof message !== 'string', 'Invalid message');

  messages[rule] = message;
}

/**
 * Set new default message,
 * default message is fired if no message is found for specific rule
 *
 * @throws {Exception}
 *
 * @example
 * setDefaultMessage('some error happened')
 */
export function setDefaultMessage(msg: string): void {
  throw_if(typeof msg !== 'string', 'Default message must be a string');

  defaultMessage = msg;
}

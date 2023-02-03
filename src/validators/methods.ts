export type ValidationResult =
  | {
      value: any;
      params?: any;
    }
  | Boolean;

/**
 * RegExp used for email validation
 */
const emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * RegExp used for IP validation
 */
const ipRegex: RegExp = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

/**
 * Validates if value contains only alphabetical characters
 *
 * @example
 * alpha('abcdEFG') => true
 * alpha('abcd123') => false
 * alpha('abcd-efg') => false
 */
export function alpha(value: string): ValidationResult {
  if (/^[a-zA-Z]+$/.test(value)) {
    return true;
  }

  return {
    value: value,
  };
}

/**
 * Validates if value contains only alphabetical characters and dashes
 *
 * @example
 * alpha_dash('abcd-EFG') => true
 * alpha_dash('abcd-EFG_hij') => false
 * alpha_dash('abcd-123') => false
 * alpha_dash('abcd_123') => false
 */
export function alpha_dash(value: string): ValidationResult {
  if (/^[A-Za-z\-]+$/.test(value)) {
    return true;
  }

  return {
    value: value,
  };
}

/**
 * Validates if value contains only alphabetical and numerical characters
 *
 * @example
 * alpha_numeric('abcd123') => true
 * alpha_numeric('abcdefg') => true
 * alpha_numeric('abc-123') => false
 */
export function alpha_numeric(value: string): ValidationResult {
  if (/^[A-Za-z0-9]+$/.test(value)) {
    return true;
  }

  return {
    value: value,
  };
}

/**
 * Validate if given value contains only digits and nothing else
 *
 * @example
 * numeric(12345) => true
 * numeric('12345') => true
 * numeric('abcdefg') => false
 */
export function numeric(value): ValidationResult {
  if (/^-?\d+$/.test(String(value))) {
    return true;
  }

  return {
    value: value,
  };
}

/**
 * Validates if given value is array
 *
 * @example
 * array(['a', 'b', 'c']) => true
 * array(null) => false
 * array('abc') => false
 */
export function array(value): ValidationResult {
  if (Array.isArray(value)) {
    return true;
  }

  return {
    value: value,
  };
}

/**
 * Validates if given values are between two numbers
 * @todo Validate only numbers here
 *
 * @example
 * between(1, 5, 25) => false
 * between(14, 5, 25) => true
 * between(5, 5, 25) => true
 */
export function between(value, from, to): ValidationResult {
  if (typeof value === 'string') {
    if (value.length >= from && value.length <= to) {
      return true;
    }
  } else {
    if (value >= from && value <= to) {
      return true;
    }
  }

  return {
    value: value,
    params: {
      from,
      to,
    },
  };
}

/**
 * Validate if given value is true or false
 *
 * @example
 * boolean(true) => true
 * boolean(false) => true
 * boolean(1) => false
 * boolean('true') => false
 */
export function boolean(value): ValidationResult {
  if (typeof value === 'boolean') {
    return true;
  }

  return {
    value: value,
  };
}

/**
 * Validate if given value is possible values of checkbox and it is checked
 *
 * @example
 * checked('on') => true
 * checked(true) => true
 * checked(0) => false
 * checked('true') => true
 */
export function checked(value): ValidationResult {
  if (value === 1 || value === 'on' || value === true || value === 'true') {
    return true;
  }

  return {
    value: value,
  };
}

/**
 * Validates if given value contains each given parameters
 *
 * @example
 * contains_all([1, 2, 3, 4, 5], 1, 2, 3) => true
 * contains_all([1, 2], 1, 2) => true
 * contains_all([1, 2, 5], 1, 2, 7) => false
 * contains_all('abcdefg', 'a', 'b') => true
 * contains_all('abcdefg', 'a', 'k') => false
 */
export function contains_all(value, ...values): ValidationResult {
  // If value is not array then it is converted to string
  // If is array type then lookup values in array
  if (!Array.isArray(value)) {
    value = String(value);
  }

  for (let i = 0, l = values.length; i < l; i++) {
    if (value.indexOf(values[i]) === -1) {
      return {
        value: value,
        params: values,
      };
    }
  }

  return true;
}

/**
 * Validate if given value contains at least one value from given values
 *
 * @example
 * contains_one([1, 2, 3, 4, 5], 1, 2, 3) => true
 * contains_one([1, 2], 1, 5, 7, 9) => true
 * contains_one([1, 2, 5], 10, 11, 25) => false
 * contains_one('abcdefg', 'a', 'o', 't') => true
 * contains_one('abcdefg', 'a', 'k') => true
 */
export function contains_one(value, ...values): ValidationResult {
  // If value is not array then it is converted to string
  // If is array type then lookup values in array
  if (!Array.isArray(value)) {
    value = String(value);
  }

  for (let i = 0, l = values.length; i < l; i++) {
    if (value.indexOf(values[i]) > -1) {
      return true;
    }
  }

  return {
    value: value,
    params: values,
  };
}

/**
 * Validates if given date is Correct date, at least it is convertable to Date string
 *
 * @example
 * date('2021-01-01') => true
 * date('20210101') => true
 * date('2021-01-01 25:34:33') => false
 * date('dummy string') => false
 */
export function date(value): ValidationResult {
  if (!isNaN(Date.parse(value))) {
    return true;
  }

  return {
    value: value,
  };
}

/**
 * Validates if given email is Correct email string
 *
 * @example
 * email('test@email.com') => true
 * email('testemail.com') => false
 * email('email.com') => false
 * email('dummy-string') => false
 */
export function email(value): ValidationResult {
  if (emailRegex.test(value)) {
    return true;
  }

  return {
    value: value,
  };
}

/**
 * Validates if given value is valid phone number
 *
 * @example
 * phone(123456789) => true
 * phone('123456789') => true
 * phone('1') => false
 * phone('null') => false
 * phone('string') => false
 */
export function phone(value): ValidationResult {
  value = String(value);
  if (/^\d{7,}$/.test(value.replace(/[\s()+\-\.]|ext/gi, ''))) {
    return true;
  }

  return {
    value: value,
  };
}

/**
 * Validates if given value equals to given string or number
 *
 * @example
 * equals(1, 1) => true
 * equals('test_string', 'test_string') => true
 * equals('a', 'b') => false
 * equals('1', 1) => true
 * equals('false', false) => true
 */
export function equals(value, param): ValidationResult {
  if (String(value) === String(param)) {
    return true;
  }

  return {
    value: value,
    params: param,
  };
}

/**
 * Validates if given value not to given string or number
 *
 * @example
 * equals(1, 1) => false
 * equals('test_string', 'test_string') => false
 * equals('a', 'b') => true
 * equals('1', 1) => false
 * equals('false', false) => false
 */
export function not_equals(value, param): ValidationResult {
  if (String(value) !== String(param)) {
    return true;
  }

  return {
    value: value,
    params: param,
  };
}

/**
 * Validates if given value exists in given array
 *
 * @example
 * in_array(1, [1,2,3]) => true
 * in_array('test', ['test','s','test_val']) => true
 * in_array(5, [1,2,3]) => false
 */
export function in_array(value, ...arr): ValidationResult {
  if (arr.indexOf(String(value)) > -1) {
    return true;
  }

  return {
    value: value,
    params: arr,
  };
}

/**
 * Validates if given value is correct ip address
 *
 * @example
 * ip('192.168.0.1') => true
 * ip('123.112.33.33') => true
 * ip('dummy_text') => false
 * ip(1) => false
 * ip(null) => false
 */
export function ip(value): ValidationResult {
  if (ipRegex.test(value)) {
    return true;
  }

  return {
    value: value,
  };
}

/**
 * Validate if given value is valid json String
 *
 * @example
 * json('{test:"false"}') => true
 * json('{test:"false","test_string"}') => false
 * json('test_string') => false
 */
export function json(value): ValidationResult {
  try {
    JSON.parse(String(value));
    return true;
  } catch (e) {
    return {
      value: value,
    };
  }
}

/**
 * Validates if given value is not greater than given param
 *
 * @example
 * max(1, 5) => true
 * max(10, 5) => false
 */
export function max(value, max): ValidationResult {
  if (typeof value === 'string') {
    if (value.length <= max) return true;
  } else if (typeof value !== undefined) {
    if (value <= max) return true;
  }

  return {
    value: value,
    params: max,
  };
}

/**
 * Validates if given value is greater then given value
 *
 * @example
 * min(1, 5) => false
 * min(10, 5) => true
 */
export function min(value, min): ValidationResult {
  if (typeof value === 'string') {
    if (value.length >= min) return true;
  } else if (typeof value !== undefined) {
    if (value >= min) return true;
  }

  return {
    value: value,
    params: min,
  };
}

/**
 * Validates if given value is string
 *
 * @example
 * string(123) => false
 * string(null) => false
 * string('123') => true
 * string('abc') => true
 */
export function string(value): ValidationResult {
  return typeof value === 'string';
}

/**
 * Validate if
 *
 * @example
 *
 */
export function not_in(value, ...arr): ValidationResult {
  if (arr.indexOf(String(value)) === -1) {
    return true;
  }

  return {
    value: value,
  };
}

/**
 * Validates if given value is Object
 *
 * @example
 * object({}) => true
 * object({a: 'b'}) => true
 * object([]) => false
 * object('abc') => false
 */
export function object(value): ValidationResult {
  if (typeof value === 'object' && !Array.isArray(value)) {
    return true;
  }

  return {
    value: value,
  };
}

/**
 * Validate if given value starts with given prefix
 *
 * @example
 * starts_with('abcefg', 'abc') => true
 * starts_with('aabcefg', 'abc') => false
 * starts_with('_abcefg', '_') => true
 * starts_with(123456, 12) =>  true
 */
export function starts_with(value, prefix): ValidationResult {
  prefix = String(prefix);
  value = String(value);
  if (value.indexOf(prefix) === 0) {
    return true;
  }

  return {
    value: value,
    params: prefix,
  };
}

/**
 * Validates if given value ends with given suffix
 *
 * @example
 * ends_with('test_string', 'ing') =>  true
 * ends_with(12345, 45) => true
 * ends_with(12345, 456) => false
 * ends_with('random_string', 'rand') => false
 */
export function ends_with(value, suffix): ValidationResult {
  suffix = String(suffix);
  value = String(value);

  if (value.indexOf(suffix, value.length - suffix.length) !== -1) {
    return true;
  }

  return {
    value: value,
    params: suffix,
  };
}

/**
 * Validates if given value is correct URL
 *
 * @example
 * url('https://google.com') => true
 * url('https//google.com') => false
 * url('abcdefg') => false
 * url('google.com') => true
 */
export function url(value): ValidationResult {
  try {
    new URL(value);
    return true;
  } catch (e) {
    return {
      value: value,
    };
  }
}

import { throw_if } from '../utils';

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

/**
 * All validation methods
 */
export let methods = {
  /**
   * Validates if value contains only alphabetical characters
   *
   * @param {String} value
   * @returns {boolean|{value}}
   * @example
   * alpha('abcdEFG') => true
   * alpha('abcd123') => false
   * alpha('abcd-efg') => false
   */
  alpha(value) {
    return /^[a-zA-Z]+$/.test(value) || { value };
  },

  /**
   * Validates if value contains only alphabetical characters and dashes
   *
   * @param value
   * @returns {boolean|{value}}
   * @example
   * alpha_dash('abcd-EFG') => true
   * alpha_dash('abcd-EFG_hij') => false
   * alpha_dash('abcd-123') => false
   * alpha_dash('abcd_123') => false
   */
  alpha_dash(value) {
    return /^[A-Za-z\-]+$/.test(value) || { value };
  },

  /**
   * Validates if value contains only alphabetical and numerical characters
   *
   * @param value
   * @returns {boolean|{value}}
   * @example
   * alpha_numeric('abcd123') => true
   * alpha_numeric('abcdefg') => true
   * alpha_numeric('abc-123') => false
   */
  alpha_numeric(value) {
    return /^[A-Za-z0-9]+$/.test(value) || { value };
  },

  /**
   * Validate if given value contains only digits and nothing else
   *
   * @param {String|Number} value
   * @returns {boolean|{value}}
   * @example
   * numeric(12345) => true
   * numeric('12345') => true
   * numeric('abcdefg') => false
   */
  numeric(value) {
    return /^-?\d+$/.test(String(value)) || { value };
  },

  /**
   * Validates if given value is array
   *
   * @param value
   * @returns {boolean|{}}
   * @example
   * array(['a', 'b', 'c']) => true
   * array(null) => false
   * array('abc') => false
   */
  array(value) {
    return Array.isArray(value) || {};
  },

  /**
   * Validates if given values are between two numbers
   * @todo Validate only numbers here
   * @param value
   * @param from
   * @param to
   * @returns {{from, to, value}|boolean}
   * @example
   * between(1, 5, 25) => false
   * between(14, 5, 25) => true
   * between(5, 5, 25) => true
   */
  between(value, from, to) {
    if (typeof value === 'string') {
      if (value.length >= from && value.length <= to) {
        return true;
      }
    } else {
      if (value >= from && value <= to) {
        return true;
      }
    }
    return { from, to, value };
  },

  /**
   * Validate if given value is true or false
   *
   * @param value
   * @returns {boolean}
   * @example
   * boolean(true) => true
   * boolean(false) => true
   * boolean(1) => false
   * boolean('true') => false
   */
  boolean(value) {
    return typeof value === 'boolean' || {};
  },

  /**
   * Validate if given value is possible values of checkbox and it is checked
   *
   * @param value
   * @returns {boolean}
   * @example
   * checked('on') => true
   * checked(true) => true
   * checked(0) => false
   * checked('true') => true
   */
  checked(value) {
    return (
      value === 1 || value === 'on' || value === true || value === 'true' || {}
    );
  },

  /**
   * Validates if given value contains each given parameters
   *
   * @param {String|Array} value
   * @param {...String|...Number} values
   * @returns {{value_to_contain: *}|boolean}
   * @example
   * contains_all([1, 2, 3, 4, 5], 1, 2, 3) => true
   * contains_all([1, 2], 1, 2) => true
   * contains_all([1, 2, 5], 1, 2, 7) => false
   * contains_all('abcdefg', 'a', 'b') => true
   * contains_all('abcdefg', 'a', 'k') => false
   */
  contains_all(value, ...values) {
    // If value is not array then it is converted to string
    // If is array type then lookup values in array
    if (!Array.isArray(value)) {
      value = String(value);
    }

    for (let i = 0, l = values.length; i < l; i++) {
      if (value.indexOf(values[i]) === -1) {
        return { value_to_contain: values[i] };
      }
    }

    return true;
  },

  /**
   * Validate if given value contains at least one value from given values
   *
   * @param {String|Array} value
   * @param {...String|...Number} values
   * @returns {{value_to_contain: *}|boolean}
   * @example
   * contains_one([1, 2, 3, 4, 5], 1, 2, 3) => true
   * contains_one([1, 2], 1, 5, 7, 9) => true
   * contains_one([1, 2, 5], 10, 11, 25) => false
   * contains_one('abcdefg', 'a', 'o', 't') => true
   * contains_one('abcdefg', 'a', 'k') => true
   */
  contains_one(value, ...values) {
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

    return { value_to_contain: values.join(',') };
  },

  /**
   * Validates if given date is Correct date, at least it is convertable to Date string
   *
   * @param {String|Number} value
   * @returns {boolean|Object}
   * @example
   * date('2021-01-01') => true
   * date('20210101') => true
   * date('2021-01-01 25:34:33') => false
   * date('dummy string') => false
   */
  date(value) {
    return !isNaN(Date.parse(value)) || {};
  },

  /**
   * Validates if given email is Correct email string
   *
   * @param {String} value
   * @returns {boolean|{value}}
   * @example
   * email('test@email.com') => true
   * email('testemail.com') => false
   * email('email.com') => false
   * email('dummy-string') => false
   */
  email(value) {
    return emailRegex.test(value) || { value };
  },

  /**
   * Validates if given value is valid phone number
   *
   * @param {String|Number} value
   * @returns {boolean|{value}}
   * @example
   * phone(123456789) => true
   * phone('123456789') => true
   * phone('1') => false
   * phone('null') => false
   * phone('string') => false
   */
  phone(value) {
    value = String(value);
    return /^\d{7,}$/.test(value.replace(/[\s()+\-\.]|ext/gi, '')) || { value };
  },

  /**
   * Validates if given value equals to given string or number
   *
   * @param {String|Number} value
   * @param {String|Number} param
   * @returns {boolean|{value}}
   * @example
   * equals(1, 1) => true
   * equals('test_string', 'test_string') => true
   * equals('a', 'b') => false
   * equals('1', 1) => true
   * equals('false', false) => true
   */
  equals(value, param) {
    return String(value) === String(param) || { value: param };
  },

  /**
   * Validates if given value exists in given array
   *
   * @param {String} value
   * @param {...String} arr
   * @returns {boolean|{value: string}}
   * @example
   * in_array(1, [1,2,3]) => true
   * in_array('test', ['test','s','test_val']) => true
   * in_array(5, [1,2,3]) => false
   */
  in_array(value, ...arr) {
    return arr.indexOf(String(value)) > -1 || { value: arr.join(',') };
  },

  /**
   * Validates if given value is correct ip address
   *
   * @param value
   * @returns {boolean|{value}}
   * @example
   * ip('192.168.0.1') => true
   * ip('123.112.33.33') => true
   * ip('dummy_text') => false
   * ip(1) => false
   * ip(null) => false
   */
  ip(value) {
    return ipRegex.test(value) || { value };
  },

  /**
   * Validate if given value is valid json String
   *
   * @param {String} value
   * @returns {{}|boolean}
   * @example
   * json('{test:"false"}') => true
   * json('{test:"false","test_string"}') => false
   * json('test_string') => false
   */
  json(value) {
    try {
      JSON.parse(String(value));
      return true;
    } catch (e) {
      return {};
    }
  },

  /**
   * Validates if given value is not greater than given param
   *
   * @param value
   * @param max
   * @returns {{max}|boolean}
   * @example
   * max(1, 5) => true
   * max(10, 5) => false
   */
  max(value, max) {
    if (typeof value === 'string') {
      if (value.length <= max) return true;
    } else if (typeof value !== undefined) {
      if (value <= max) return true;
    }
    return { max };
  },

  /**
   * @param value
   * @param min
   * @returns {{min}|boolean}
   */
  min(value, min) {
    if (typeof value === 'string') {
      if (value.length >= min) return true;
    } else if (typeof value !== undefined) {
      if (value >= min) return true;
    }
    return { min };
  },

  /**
   * @param value
   * @param param
   * @returns {boolean|{value}}
   */
  not_equals(value, param) {
    return String(value) !== String(param) || { value: param };
  },

  /**
   * Validate if
   * @param value
   * @param arr
   * @returns {boolean|{value}}
   */
  not_in(value, ...arr) {
    return arr.indexOf(String(value)) === -1 || { value };
  },

  /**
   * Validates if given value is Object
   *
   * @param {Object} value
   * @returns {boolean|{value}}
   * @example
   * object({}) => true
   * object({a: 'b'}) => true
   * object([]) => false
   * object('abc') => false
   */
  object(value) {
    return (typeof value === 'object' && !Array.isArray(value)) || { value };
  },

  /**
   * Validate if given value starts with given prefix
   * @param {String|Number} value
   * @param {String|Number} prefix
   * @returns {boolean|{prefix: string}}
   * @example
   * starts_with('abcefg', 'abc') => true
   * starts_with('aabcefg', 'abc') => false
   * starts_with('_abcefg', '_') => true
   * starts_with(123456, 12) =>  true
   */
  starts_with(value, prefix) {
    prefix = String(prefix);
    value = String(value);
    return value.indexOf(prefix) === 0 || { prefix };
  },

  /**
   * Validates if given value ends with given suffix
   *
   * @param {String|Number} value
   * @param {String|Number} suffix
   * @returns {boolean|{suffix: string}}
   * @example
   * ends_with('test_string', 'ing') =>  true
   * ends_with(12345, 45) => true
   * ends_with(12345, 456) => false
   * ends_with('random_string', 'rand') => false
   */
  ends_with(value, suffix) {
    suffix = String(suffix);
    value = String(value);
    return (
      value.indexOf(suffix, value.length - suffix.length) !== -1 || { suffix }
    );
  },

  /**
   * Validates if given value is correct URL
   *
   * @param {String} value
   * @returns {{value}|boolean}
   * @example
   * url('https://google.com') => true
   * url('https//google.com') => false
   * url('abcdefg') => false
   * url('google.com') => true
   */
  url(value) {
    try {
      new URL(value);
      return true;
    } catch (e) {
      return { value };
    }
  },

  /**
   *
   * @param {String} value
   * @returns {Boolean}
   * @example
   * string(123) => false
   * string(null) => false
   * string('123') => true
   * string('abc') => true
   */
  string(value) {
    return typeof value === 'string';
  },
};

/**
 * @param {string} name
 * @returns {function}
 */
export function getValidationMethod(name) {
  throw_if(
    methods.hasOwnProperty(name) === false,
    `The validation method "${name}" does not exist`
  );
  return methods[name];
}

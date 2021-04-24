import { methods } from './methods';

it('should validate alpha/numeric characters', () => {
  const { alpha, alpha_dash, alpha_numeric } = methods;

  expect(alpha('aAbBcCdD')).toBe(true);
  expect(alpha('Abc123')).not.toBe(true);

  expect(alpha_dash('aAbBcCdD')).toBe(true);
  expect(alpha_dash('a-A-b-B-c-')).toBe(true);
  expect(alpha_dash('aBc-1')).not.toBe(true);

  expect(alpha_numeric('aBc1')).toBe(true);
  expect(alpha_numeric('aBc-1')).not.toBe(true);
});

it('should validate in between number values', () => {
  const { between } = methods;

  expect(between(10, 1, 10)).toBe(true);
  expect(between(-20, 4, 7)).not.toBe(true);

  expect(between('random_string', 10, 70)).toBe(true);
  expect(between('random_string', 2, 4)).not.toBe(true);
});

it('should validate boolean values', () => {
  const { boolean } = methods;

  expect(boolean(true)).toBe(true);
  expect(boolean(false)).toBe(true);

  expect(boolean('true')).not.toBe(true);
  expect(boolean(1)).not.toBe(true);
});

it('should validate checkbox (checked) values', () => {
  const { checked } = methods;

  expect(checked(true)).toBe(true);
  expect(checked(1)).toBe(true);
  expect(checked('on')).toBe(true);
  expect(checked('true')).toBe(true);

  expect(checked('yes')).not.toBe(true);
  expect(checked('checked')).not.toBe(true);
});

it('should contain all the values', () => {
  const { contains_all } = methods;

  expect(contains_all([1, 2, 3], 1, 2, 3)).toBe(true);
  expect(contains_all('random_string', 'str')).toBe(true);

  expect(contains_all([1, 2, 3], 1, 4, 5)).not.toBe(true);
  expect(contains_all('random_string', 'hello')).not.toBe(true);
});

it('should contain one of the values', () => {
  const { contains_one } = methods;

  expect(contains_one([1, 2, 3], 1, 4)).toBe(true);
  expect(contains_one('random_string', 'str')).toBe(true);

  expect(contains_one([1, 2, 3], 4, 5, 6)).not.toBe(true);
  expect(contains_one('random_string', 'hello')).not.toBe(true);
});

it('should validate a date', () => {
  const { date } = methods;

  expect(date('2000-01-01')).toBe(true);
  expect(date(new Date())).toBe(true);

  expect(date('')).not.toBe(true);
  expect(date('1st of january')).not.toBe(true);
});

it('should validate an email', () => {
  const { email } = methods;

  expect(email('user@example.org')).toBe(true);
  expect(email('user+1@example.com')).toBe(true);

  expect(email(true)).not.toBe(true);
  expect(email(1)).not.toBe(true);
  expect(email('not_an_email')).not.toBe(true);
});

it('should validate value ending with another', () => {
  const { ends_with } = methods;

  expect(ends_with('random_string', 'ing')).toBe(true);
  expect(ends_with('random_string', '_string')).toBe(true);

  expect(ends_with('random_string', 'hello')).not.toBe(true);
  expect(ends_with('random_string', 'random')).not.toBe(true);
  expect(ends_with('random_string', 'str')).not.toBe(true);
});

it('should validate equal values', () => {
  const { equals } = methods;

  expect(equals('test', 'test')).toBe(true);
  expect(equals('1', 1)).toBe(true);
  expect(equals(1, 1)).toBe(true);

  expect(equals('random_string', 'hello')).not.toBe(true);
  expect(equals(1, true)).not.toBe(true);
});

it('should validate if value is in array', () => {
  const { in_array } = methods;

  expect(in_array('test', 'test')).toBe(true);
  expect(in_array('test', 'a', 'b', 'test', 'a')).toBe(true);

  expect(in_array('test', 'a', 'b', 'c')).not.toBe(true);
});

it('should validate ip', () => {
  const { ip } = methods;

  expect(ip('127.0.0.1')).toBe(true);
  expect(ip('192.168.1.1')).toBe(true);

  // TODO: Add ipv6 support
  // expect(ip('::1')).toBe(true);

  expect(ip('not_an_ip')).not.toBe(true);
  expect(ip(1)).not.toBe(true);
  expect(ip(true)).not.toBe(true);
});

it('should validate json', () => {
  const { json } = methods;

  expect(json('{"name": "Julia", "active": true}')).toBe(true);
  expect(json('{"name": oops}')).not.toBe(true);
});

it('should validate value below max', () => {
  const { max } = methods;

  expect(max(40, 50)).toBe(true);
  expect(max('short_string', 40)).toBe(true);

  expect(max(40, -10)).not.toBe(true);
  expect(max('short_string', 5)).not.toBe(true);
});

it('should validate value above min', () => {
  const { min } = methods;

  expect(min(40, 20)).toBe(true);
  expect(min('short_string', 4)).toBe(true);

  expect(min(40, 100)).not.toBe(true);
  expect(min('short_string', 20)).not.toBe(true);
});

it('should validate not equal values', () => {
  const { not_equals } = methods;

  expect(not_equals('random_string', 'hello')).toBe(true);
  expect(not_equals(10, 20)).toBe(true);
  expect(not_equals(1, true)).toBe(true);

  expect(not_equals('test', 'test')).not.toBe(true);
  expect(not_equals('1', 1)).not.toBe(true);
  expect(not_equals(1, 1)).not.toBe(true);
});

it('should validate numeric value', () => {
  const { numeric } = methods;

  expect(numeric(10)).toBe(true);
  expect(numeric('10')).toBe(true);
  expect(numeric(-10)).toBe(true);
  expect(numeric('-10')).toBe(true);

  expect(numeric(true)).not.toBe(true);
  expect(numeric('twelve')).not.toBe(true);
});

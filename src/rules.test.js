import { functions } from './rules';

it('should validate alpha/numeric characters', () => {
  const { alpha, alpha_dash, alpha_numeric } = functions;

  expect(alpha('aAbBcCdD')).toBe(true);
  expect(alpha('Abc123')).not.toBe(true);

  expect(alpha_dash('aAbBcCdD')).toBe(true);
  expect(alpha_dash('a-A-b-B-c-')).toBe(true);
  expect(alpha_dash('aBc-1')).not.toBe(true);

  expect(alpha_numeric('aBc1')).toBe(true);
  expect(alpha_numeric('aBc-1')).not.toBe(true);
});

it('should validate in between number values', () => {
  const { between } = functions;

  expect(between(10, 1, 10)).toBe(true);
  expect(between(-20, 4, 7)).not.toBe(true);

  expect(between('random_string', 10, 70)).toBe(true);
  expect(between('random_string', 2, 4)).not.toBe(true);
});

it('should validate boolean values', () => {
  const { boolean } = functions;

  expect(boolean(true)).toBe(true);
  expect(boolean(false)).toBe(true);

  expect(boolean('true')).not.toBe(true);
  expect(boolean(1)).not.toBe(true);
});

it('should validate checkbox (checked) values', () => {
  const { checked } = functions;

  expect(checked(true)).toBe(true);
  expect(checked(1)).toBe(true);
  expect(checked('on')).toBe(true);
  expect(checked('true')).toBe(true);

  expect(checked('yes')).not.toBe(true);
  expect(checked('checked')).not.toBe(true);
});

it('should contain all the values', () => {
  const { contains_all } = functions;

  expect(contains_all([1, 2, 3], 1, 2, 3)).toBe(true);
  expect(contains_all('random_string', 'str')).toBe(true);

  expect(contains_all([1, 2, 3], 1, 4, 5)).not.toBe(true);
  expect(contains_all('random_string', 'hello')).not.toBe(true);
});

it('should contain one of the values', () => {
  const { contains_one } = functions;

  expect(contains_one([1, 2, 3], 1, 4)).toBe(true);
  expect(contains_one('random_string', 'str')).toBe(true);

  expect(contains_one([1, 2, 3], 4, 5, 6)).not.toBe(true);
  expect(contains_one('random_string', 'hello')).not.toBe(true);
});

it('should validate a date', () => {
  const { date } = functions;

  expect(date('2000-01-01')).toBe(true);
  expect(date(new Date())).toBe(true);

  expect(date('')).not.toBe(true);
  expect(date('1st of january')).not.toBe(true);
});

it('should validate an email', () => {
  const { email } = functions;

  expect(email('user@example.org')).toBe(true);
  expect(email('user+1@example.com')).toBe(true);

  expect(email(true)).not.toBe(true);
  expect(email(1)).not.toBe(true);
  expect(email('not_an_email')).not.toBe(true);
});

it('should validate value ending with another', () => {
  const { ends_with } = functions;

  expect(ends_with('random_string', 'ing')).toBe(true);
  expect(ends_with('random_string', '_string')).toBe(true);

  expect(ends_with('random_string', 'hello')).not.toBe(true);
  expect(ends_with('random_string', 'random')).not.toBe(true);
  expect(ends_with('random_string', 'str')).not.toBe(true);
});

it('should validate equal values', () => {
  const { equals } = functions;

  expect(equals('test', 'test')).toBe(true);
  expect(equals('1', 1)).toBe(true);
  expect(equals(1, 1)).toBe(true);

  expect(equals('random_string', 'hello')).not.toBe(true);
  expect(equals(1, true)).not.toBe(true);
});

it('should validate if value is in array', () => {
  const { in_array } = functions;

  expect(in_array('test', 'test')).toBe(true);
  expect(in_array('test', 'a', 'b', 'test', 'a')).toBe(true);

  expect(in_array('test', 'a', 'b', 'c')).not.toBe(true);
});

it('should validate ip', () => {
  const { ip } = functions;

  expect(ip('127.0.0.1')).toBe(true);
  expect(ip('192.168.1.1')).toBe(true);

  // TODO: Add ipv6 support
  // expect(ip('::1')).toBe(true);

  expect(ip('not_an_ip')).not.toBe(true);
  expect(ip(1)).not.toBe(true);
  expect(ip(true)).not.toBe(true);
});

it('should validate json', () => {
  const { json } = functions;

  expect(json('{"name": "Julia", "active": true}')).toBe(true);
  expect(json('{"name": oops}')).not.toBe(true);
});

it('should validate value below max', () => {
  const { max } = functions;

  expect(max(40, 50)).toBe(true);
  expect(max('short_string', 40)).toBe(true);

  expect(max(40, -10)).not.toBe(true);
  expect(max('short_string', 5)).not.toBe(true);
});

it('should validate value above min', () => {
  const { min } = functions;

  expect(min(40, 20)).toBe(true);
  expect(min('short_string', 4)).toBe(true);

  expect(min(40, 100)).not.toBe(true);
  expect(min('short_string', 20)).not.toBe(true);
});

it('should validate not equal values', () => {
  const { not_equals } = functions;

  expect(not_equals('random_string', 'hello')).toBe(true);
  expect(not_equals(10, 20)).toBe(true);
  expect(not_equals(1, true)).toBe(true);

  expect(not_equals('test', 'test')).not.toBe(true);
  expect(not_equals('1', 1)).not.toBe(true);
  expect(not_equals(1, 1)).not.toBe(true);
});

it('should validate numeric value', () => {
  const { numeric } = functions;

  expect(numeric(10)).toBe(true);
  expect(numeric('10')).toBe(true);
  expect(numeric(-10)).toBe(true);
  expect(numeric('-10')).toBe(true);

  expect(numeric(true)).not.toBe(true);
  expect(numeric('twelve')).not.toBe(true);
});

it('should validate numeric value', () => {
  const { object } = functions;

  expect(object({})).toBe(true);
  expect(object(new Map())).toBe(true);
  expect(object({ name: 'Sergio' })).toBe(true);

  expect(object([])).not.toBe(true);
  expect(object(true)).not.toBe(true);
  expect(object(100)).not.toBe(true);
  expect(object('not_an_object')).not.toBe(true);
});

it('should validate value starting with another', () => {
  const { starts_with } = functions;

  expect(starts_with('random_string', 'random_')).toBe(true);
  expect(starts_with('random_string', 'r')).toBe(true);

  expect(starts_with('random_string', 'hello')).not.toBe(true);
  expect(starts_with('random_string', 'dom')).not.toBe(true);
  expect(starts_with('random_string', 'ing')).not.toBe(true);
});

it('should validate url', () => {
  const { url } = functions;

  expect(url('http://example.com')).toBe(true);
  expect(url('https://www.example.org')).toBe(true);
  expect(url('https://www.example.org/dir?param#hash')).toBe(true);

  expect(url('a@a')).not.toBe(true);
  expect(url(true)).not.toBe(true);
});

it('should validate phone numbers', () => {
  const { phone } = functions;

  expect(phone('1122334455')).toBe(true);
  expect(phone('11 22 33 44 55')).toBe(true);
  expect(phone('+33122334455')).toBe(true);

  expect(phone(true)).not.toBe(true);
  expect(phone(1)).not.toBe(true);
});

it('should validate required values', () => {
  const { required } = functions;

  expect(required('required_string')).toBe(true);
  expect(required(true)).toBe(true);
  expect(required('true')).toBe(true);
  expect(required({ name: 'James' })).toBe(true);
  expect(required([1, 2, 3])).toBe(true);

  expect(required(null)).not.toBe(true);
  expect(required(undefined)).not.toBe(true);
  expect(required(false)).not.toBe(true);
  expect(required('')).not.toBe(true);

  // Do not accept empty objects or arrays
  expect(required({})).not.toBe(true);
  expect(required([])).not.toBe(true);
});

it('should validate string values', () => {
  const { string } = functions;

  expect(string('is_a_string')).toBe(true);
  expect(string('')).toBe(true);

  expect(string(10)).not.toBe(true);
  expect(string(true)).not.toBe(true);
  expect(string({})).not.toBe(true);
  expect(string([])).not.toBe(true);
});

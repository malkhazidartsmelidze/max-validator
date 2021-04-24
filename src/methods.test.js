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

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

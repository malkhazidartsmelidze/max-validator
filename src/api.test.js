import { validate, extend } from './api';

it('should validate an object', () => {
  const data = {
    name: 'Boris',
    age: 40,
  };

  const scheme = {
    name: 'string|required',
    age: 'numeric',
  };

  expect(validate(data, scheme).hasError).toBe(false);
});

it('should get errors on failed validation', () => {
  const data = {
    age: 'twelve',
  };

  const scheme = {
    age: 'numeric|required',
  };

  expect(validate(data, scheme).hasError).toBe(true);
});

it('should throw and error if the validation method does not exist', () => {
  const scheme = {
    name: 'unknown',
  };

  expect(() => validate({}, scheme)).toThrowError();
});

it('should be extended with custom rule', () => {
  extend(
    'custom_rule',
    (value) => value === 'test' || { value },
    'Default Error Message: :name cant be :value'
  );

  const scheme = { name: 'custom_rule' };

  expect(validate({ name: 'test' }, scheme).hasError).toBe(false);
  expect(validate({ name: 'not_test' }, scheme).hasError).toBe(true);
});

it('should return a result error helper with correct data', () => {
  const scheme = {
    name: 'required|string|min:40|starts_with:Ga',
    age: 'numeric',
  };

  const data = {
    name: 'test',
    age: 40,
  };

  expect(validate(data, scheme).isError('name')).toBe(true);
  expect(validate(data, scheme).isError('name', true)).toBe(false);

  expect(validate(data, scheme).isError('name', 'required')).toBe(false);
  expect(validate(data, scheme).isError('name', 'string')).toBe(false);
  expect(validate(data, scheme).isError('name', 'min')).toBe(true);
  expect(validate(data, scheme).isError('name', 'starts_with')).toBe(true);
});

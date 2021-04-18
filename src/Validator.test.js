import { validate } from './Validator';

test('should validate an object', () => {
  const data = {
    name: 'Boris',
    age: 40,
  };

  const scheme = {
    name: 'string:required',
    age: 'numeric',
  };

  expect(validate(data, scheme).hasError).toBe(false);
});

test('should get errors on failed validation', () => {
  const scheme = {
    name: 'string|required',
    age: 'numeric|required',
  };

  expect(Object.keys(validate({}, scheme).errors)).toEqual(['name', 'age']);
});

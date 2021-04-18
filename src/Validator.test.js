import { validate } from './Validator';

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

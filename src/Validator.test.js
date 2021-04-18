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

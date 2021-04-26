import { parseScheme } from './scheme';
import { keys } from './util';

it('should parse schemes with strings as rules', () => {
  const scheme = {
    name: 'required|string|min:4',
    age: 'numeric|min:0',
  };

  expect(() => parseScheme(scheme)).not.toThrowError();

  expect(keys(parseScheme(scheme).name)).toEqual(['required', 'string', 'min']);
  expect(keys(parseScheme(scheme).age)).toEqual(['numeric', 'min']);
});

it('should parse schemes with an array of rules', () => {
  const scheme = {
    name: ['required', 'string', 'min:4', () => true],
    age: ['numeric', 'min:0'],
  };

  expect(() => parseScheme(scheme)).not.toThrowError();

  expect(keys(parseScheme(scheme).name)).toEqual([
    'required',
    'string',
    'min',
    'anonymous_0',
  ]);

  expect(keys(parseScheme(scheme).age)).toEqual(['numeric', 'min']);
});

it('should parse schemes with an object of rules', () => {
  const scheme = {
    name: {
      required: true,
      string: true,
      min: 4,
      test(value) {
        return value === 'test' || { value };
      },
    },
    age: {
      numeric: true,
      min: 0,
    },
  };

  expect(() => parseScheme(scheme)).not.toThrowError();

  expect(keys(parseScheme(scheme).name)).toEqual([
    'required',
    'string',
    'min',
    'test',
  ]);

  expect(keys(parseScheme(scheme).age)).toEqual(['numeric', 'min']);
});

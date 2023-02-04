import {
  parse_ruleset,
  parse_string_ruleset,
  parse_array_ruleset,
  parse_object_ruleset,
} from '../src/lib/ruleset';

it('should check if string ruleset parsing works', () => {
  const single_rule = parse_ruleset('string');
  const multiple_rule = parse_ruleset('string|email');
  const multiple_with_params = parse_ruleset('string|email|max:100');
  const multiple_with_multiple_params = parse_ruleset(
    'string|email|max:100,111'
  );

  // Check if is array
  expect(Array.isArray(single_rule)).toBe(true);
  expect(Array.isArray(multiple_rule)).toBe(true);
  expect(Array.isArray(multiple_with_params)).toBe(true);
  expect(Array.isArray(multiple_with_multiple_params)).toBe(true);

  // Check array lengths
  expect(single_rule.length).toBe(1);
  expect(multiple_rule.length).toBe(2);
  expect(multiple_with_params.length).toBe(3);
  expect(multiple_with_multiple_params.length).toBe(3);
});

it('should test if array rule parsing works', () => {
  const single_rule = parse_ruleset(['string']);
  const multiple_rule = parse_ruleset(['string', 'email']);
  const multiple_with_params = parse_ruleset(['string', 'email', 'max:100']);
  const multiple_with_multiple_params = parse_ruleset([
    'string',
    'email',
    'max:100,111',
  ]);

  // Check if is array
  expect(Array.isArray(single_rule)).toBe(true);
  expect(Array.isArray(multiple_rule)).toBe(true);
  expect(Array.isArray(multiple_with_params)).toBe(true);
  expect(Array.isArray(multiple_with_multiple_params)).toBe(true);

  // Check array lengths
  expect(single_rule.length).toBe(1);
  expect(multiple_rule.length).toBe(2);
  expect(multiple_with_params.length).toBe(3);
  expect(multiple_with_multiple_params.length).toBe(3);
});

it('should test if object rule parsing works', () => {
  const single_rule = parse_ruleset({
    string: true,
  });
  const multiple_rule = parse_ruleset({
    string: true,
    email: true,
  });
  const multiple_with_params = parse_ruleset({
    string: true,
    email: true,
    max: 100,
  });
  const multiple_with_multiple_params = parse_ruleset({
    string: true,
    email: true,
    between: [100, 111],
  });

  // Check if is array
  expect(Array.isArray(single_rule)).toBe(true);
  expect(Array.isArray(multiple_rule)).toBe(true);
  expect(Array.isArray(multiple_with_params)).toBe(true);
  expect(Array.isArray(multiple_with_multiple_params)).toBe(true);

  // Check array lengths
  expect(single_rule.length).toBe(1);
  expect(multiple_rule.length).toBe(2);
  expect(multiple_with_params.length).toBe(3);
  expect(multiple_with_multiple_params.length).toBe(3);
});

it('Should test if validation methods and properties are working properly', () => {
  const string_ruleset = parse_ruleset(
    'string|min:10|max:10,111|in_array:val1,val2,val3'
  );
  const array_ruleset = parse_ruleset([
    'string',
    'min:10',
    'max:10,111',
    'in_array:val1,val2,val3',
  ]);
  const object_ruleset = parse_ruleset({
    string: true,
    min: 10,
    max: [10, 11],
    in_array: ['val1', 'val2', 'val3'],
  });

  // Check length of params
  expect(string_ruleset.length).toBe(4);
  expect(array_ruleset.length).toBe(4);
  expect(object_ruleset.length).toBe(4);

  expect(string_ruleset).toHaveProperty('0.type');
  expect(string_ruleset).toHaveProperty('0.validator');
  expect(string_ruleset).toHaveProperty('0.message');
  expect(string_ruleset).not.toHaveProperty('0.params'); // Not for string validation
  expect(string_ruleset).toHaveProperty('1.params');
  expect(string_ruleset).toHaveProperty('2.params');
  expect(string_ruleset).toHaveProperty('3.params');

  expect(array_ruleset).toHaveProperty('0.type');
  expect(array_ruleset).toHaveProperty('0.validator');
  expect(array_ruleset).toHaveProperty('0.message');
  expect(array_ruleset).not.toHaveProperty('0.params'); // Not for string validation
  expect(array_ruleset).toHaveProperty('1.params');
  expect(array_ruleset).toHaveProperty('2.params');
  expect(array_ruleset).toHaveProperty('3.params');

  expect(object_ruleset).toHaveProperty('0.type');
  expect(object_ruleset).toHaveProperty('0.validator');
  expect(object_ruleset).toHaveProperty('0.message');
  // Params are for each object validation rules
  expect(object_ruleset).toHaveProperty('0.params'); // Not for string validation
  expect(object_ruleset).toHaveProperty('1.params');
  expect(object_ruleset).toHaveProperty('2.params');
  expect(object_ruleset).toHaveProperty('3.params');
});

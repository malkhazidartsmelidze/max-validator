import V from '../index';

it('should replace the default error message', () => {
  const test_message = 'Custom error message';

  V.config.setDefaultMessage(test_message);
  expect(V.config.defaultMessage).toBe(test_message);

  // Because expects string message
  expect(() => V.config.setDefaultMessage(1234)).toThrowError();

  // Validate and get default error message
  V.extend('invalid_rule', () => false); // Create new rule, which always fails
  const result = V.validate({ test: 'data' }, { test: 'invalid_rule' });
  expect(result.errors.test[0]).toBe(test_message);
});

it('should merge/replace multiple messages', () => {
  const test_message = 'This is a an example message';

  V.config.setMessages({
    test_rule: test_message,
    number: test_message,
  });

  expect(Object.keys(V.config.messages)).toContain('test_rule');
  expect(V.config.messages.test_rule).toBe(test_message);
  expect(V.config.messages.number).toBe(test_message);

  // expects only object object
  expect(() => V.config.setMessages(1234)).toThrowError();

  // expects only string as message
  expect(() => V.config.setMessages({ test_rule: 1234 })).toThrowError();

  // Validate and get default error message
  V.extend('test_rule', () => false); // Create new rule, which always fails
  const result = V.validate({ test: 'data' }, { test: 'test_rule' });
  expect(result.errors.test[0]).toBe(test_message);
});

it('should replace/add message in messages object', () => {
  const test_message = 'This is new test message';

  // change message
  V.config.setMessage('number', test_message);
  expect(V.config.messages.number).toBe(test_message);

  // add new message
  V.config.setMessage('new_rule', test_message);
  expect(Object.keys(V.config.messages)).toContain('new_rule');
  expect(V.config.messages.new_rule).toBe(test_message);

  // Validate and check error message
  V.extend('new_rule', () => false); // Create new rule, which always fails
  const result = V.validate({ test: 'data' }, { test: 'new_rule' });
  expect(result.errors.test[0]).toBe(test_message);
});

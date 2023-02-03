import V from '../index';

it('should replace the default error message', () => {
  V.config.setDefaultMessage('Custom error message');
  expect(V.config.defaultMessage).toBe('Custom error message');
});

it('should throw an error when we will pass non-string argument as message', () => {
  // Because expects string message
  expect(() => V.config.setDefaultMessage(1234)).toThrowError();
});

it('should replace an error messsage of rule', () => {
  // Create new rules, that always returns false
  // hence invalidated and always returns error message
  V.extend('new_rule', () => false);

  // Set message of new_rule to be give message
  V.config.setMessage('new_rule', 'test-error-message-of-new-rule');
  expect(
    V.validate({ test: 'data' }, { test: 'new_rule' }).errors.test[0]
  ).toBe('test-error-message-of-new-rule');
});

it('should add new rule and message of rule', () => {
  // Create new rules, that always returns false
  // hence invalidated and always returns error message
  V.extend('invalid_rule', () => false, 'test-error-message-of-invalid-rule');

  // Set message of invalid_rule to be given message
  expect(
    V.validate({ test: 'data' }, { test: 'invalid_rule' }).errors.test[0]
  ).toBe('test-error-message-of-invalid-rule');
});

it('Should replace message for existing rule', () => {
  // test for existing rule
  V.config.setMessage('number', 'new rule message');
  V.config.setMessages({
    string: 'new string message',
    required: 'new required message',
  });
  expect(V.config.messages.number).toBe('new rule message');
  expect(V.config.messages.string).toBe('new string message');
  expect(V.config.messages.required).toBe('new required message');
});

it('Should create new rule message and validate it', () => {
  V.config.setMessage('new_rule', 'new_rule');
  V.config.setMessages({
    new_rule2: 'new_rule2',
    new_rule3: 'new_rule3',
  });

  // add new message
  expect(V.config.messages.new_rule).toBe('new_rule');
  expect(V.config.messages.new_rule2).toBe('new_rule2');
  expect(V.config.messages.new_rule3).toBe('new_rule3');
});

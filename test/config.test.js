import V from '../index';

it('should replace the default error message', () => {
  V.config.setDefaultMessage('Custom error message');
  expect(V.config.defaultMessage).toBe('Custom error message');

  // Because expects string message
  expect(() => V.config.setDefaultMessage(1234)).toThrowError();

  /** @todo validate and check if returns default message */
});

it('should merge/replace multiple messages', () => {
  const test_message = 'This is a an example message';

  V.config.setMessages({
    replace_rule: test_message,
    number: test_message,
  });

  expect(Object.keys(V.config.messages)).toContain('replace_rule');
  expect(V.config.messages.replace_rule).toBe(test_message);
  expect(V.config.messages.number).toBe(test_message);

  // expects only object object
  expect(() => V.config.setMessages(1234)).toThrowError();
  // expects only string as message
  expect(() => V.config.setMessages({ replace_rule: 1234 })).toThrowError();

  /** @todo validate and check if returns changed message */
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

  /** @todo validate and check if returns changed message */
});

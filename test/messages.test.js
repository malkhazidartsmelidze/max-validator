/**
 * Test deprecated messages,
 * Will be removed in next (1.4) version
 */
import {
  messages,
  defaultMessage,
  setMessages,
  setMessage,
  setDefaultMessage,
} from '../src/messages';

it('should replace the default error message', () => {
  setDefaultMessage('Custom error message');
  expect(defaultMessage).toBe('Custom error message');

  // Because expects string message
  expect(() => setDefaultMessage(1234)).toThrowError();

  /** @todo validate and check if returns default message */
});

it('should merge/replace messages', () => {
  const test_message = 'This is a an example message';

  setMessages({
    replace_rule: test_message,
    number: test_message,
  });

  expect(Object.keys(messages)).toContain('replace_rule');
  expect(messages.replace_rule).toBe(test_message);
  expect(messages.number).toBe(test_message);

  // expects only object object
  expect(() => setMessages(1234)).toThrowError();
  // expects only string as message
  expect(() => setMessages({ replace_rule: 1234 })).toThrowError();

  /** @todo validate and check if returns changed message */
});

it('should replace/add message in messages object', () => {
  const test_message = 'This is new test message';

  // change message
  setMessage('number', test_message);
  expect(messages.number).toBe(test_message);

  // add new message
  setMessage('new_rule', test_message);
  expect(Object.keys(messages)).toContain('new_rule');
  expect(messages.new_rule).toBe(test_message);

  /** @todo validate and check if returns changed message */
});

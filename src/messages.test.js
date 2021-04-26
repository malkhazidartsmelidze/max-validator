import {
  messages,
  defaultMessage,
  setMessages,
  setDefaultMessage,
  formatMessage,
} from './messages';

it('should replace the default error message', () => {
  setDefaultMessage('Custom error message');
  expect(defaultMessage).toBe('Custom error message');
  expect(() => setDefaultMessage(1234)).toThrowError();
});

it('should merge/replace messages', () => {
  setMessages({ replace_rule: 'This is a an example' });
  expect(Object.keys(messages)).toContain('replace_rule');
  expect(() => setMessages(1234)).toThrowError();
});

it('should format a messages with params', () => {
  expect(formatMessage('required', { name: 'prop' })).toBe('prop is required');
});

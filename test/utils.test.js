import { throw_if } from '../src/utils';

it('should throw an exception', () => {
  expect(throw_if(true, 'exception message')).toThrow('exception message');
  expect(throw_if(1, 'exception message')).toThrow('exception message');
  expect(throw_if(2, 'exception message')).toThrow('exception message');
  expect(throw_if(Symbol('t'), 'exception message')).toThrow(
    'exception message'
  );
  expect(throw_if({}, 'exception message')).toThrow('exception message');
  expect(throw_if([], 'exception message')).toThrow('exception message');
});

it('should not throw exception', () => {
  expect(throw_if(false, 'exception message')).toBe(undefined);
  expect(throw_if(null, 'exception message')).toBe(undefined);
  expect(throw_if(0, 'exception message')).toBe(undefined);
});

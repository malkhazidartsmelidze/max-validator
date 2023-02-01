import { throw_if } from '../src/utils';

it('should throw an exception', () => {
  // Boolean resolves as boolean
  expect(() => throw_if(true, 'exception message true')).toThrow(
    'exception message true'
  );

  // Numbers resolve as true
  expect(() => throw_if(1, 'exception message 1')).toThrow(
    'exception message 1'
  );
  expect(() => throw_if(2, 'exception message 2')).toThrow(
    'exception message 2'
  );

  // Any empty objects, symbols and arrays resolve as true
  expect(() => throw_if(Symbol('t'), 'exception message symbol')).toThrow(
    'exception message symbol'
  );
  expect(() => throw_if({}, 'exception message {}')).toThrow(
    'exception message {}'
  );
  expect(() => throw_if([], 'exception message []')).toThrow(
    'exception message []'
  );
});

it('should not throw exception', () => {
  // doesn't throws exception if given parameter deosn't resolve as true
  expect(() => throw_if(false, 'exception message')).not.toThrow();
  expect(() => throw_if(null, 'exception message')).not.toThrow();
  expect(() => throw_if(0, 'exception message')).not.toThrow();
});

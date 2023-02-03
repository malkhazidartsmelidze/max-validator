import { parse_rule } from '../src/lib/rule';
import { parse_scheme } from '../src/lib/scheme';

it('should check if string ruleset parsing works', () => {
  console.log(
    parse_scheme({
      data: 'required|nullable|min:4',
      data2: [
        'required',
        'nullable',
        'between:20,22',
        () => {
          return 1;
        },
      ],
      date: {
        required: true,
        nullable: true,
        min: 5,
        fjunc: () => {
          return 1;
        },
        s: {
          validator: () => {},
          message: 'this is test message',
        },
      },
    })
  );
});

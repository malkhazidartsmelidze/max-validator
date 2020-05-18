var validator = require('./Validator/Validator.js');

var result = validator.validate(
  {
    firstname: 'malkhazi',
    age: 20,
    waist: '40',
    policy: 12,
    names: 'malkhazi',
    info: {},
    family: 1,
    number: '598571672',
    name: 'maakho1',
    ald: 'maak1ho-',
    mail: 'darcmelidze1997g.com',
    in: '1',
    cantbe: 2,
  },
  {
    firstname: 'required|between:5,50',
    age: 'required|numeric|between:18,22|min:30',
    height: 'nullable|between:100,230',
    weight: 'required|between:1002,230',
    waist: 'nullable|numeric|between:10,200|max:20',
    policy: 'required|checked',
    names: 'required|array',
    info: 'nullable|object',
    family: 'nullable|boolean',
    number: 'nullable|alpha_numeric',
    name: 'nullable|alpha',
    ald: 'nullable|alpha_dash',
    mail: 'nullable|email',
    in: 'in_array:1,2,3,4,5,6',
    cantbe: 'required|not_in:1,2,3,4,5,6',
  }
);
console.log(result);
// Rule.parseScheme({
//   name: 'required|min_length:5|max_length:20',
// });
// console.log(Rules);
// console.log(validator);

module.exports = {
  validator,
};

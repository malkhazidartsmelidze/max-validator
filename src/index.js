var validator = require('./Validator/Validator.js');
var checked = require('./validators/checked');

var result = validator.validate(
  {
    firstname: 'malkhazi',
    age: 20,
    waist: '40',
    policy: 12,
    names: 'malkhazi',
    info: 'not object',
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

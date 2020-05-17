const validator = require('./Validator/Validator.js');
const Rule = require('./Validator/Rule');

validator.validate(
  {
    name: 'malkhazi',
    age: 20,
  },
  {
    name: 'required|between:20,50',
    age: 'required|between:18,22',
  }
);

// Rule.parseScheme({
//   name: 'required|min_length:5|max_length:20',
// });
// console.log(Rules);
// console.log(validator);

module.exports = {
  validator,
};

var Validator = require('./src/Validator.js');

function checkName(name, value) {
  return 'ad';
}

Validator.validate(
  {
    name: 'Malkhazi',
    lastname: 'Dartsmelidze',
    age: 22,
    gender: 'male',
    gg: 'asdf1',
    aa: 'asdf',
  },
  {
    name: 'required|string|min:30',
    lastname: 'required|string',
    age: [
      'required',
      'min:30',
      checkName,
      function (value) {
        return String(value);
      },
      function (value) {
        return String(value);
      },
    ],
    gender: {
      required: true,
      alpha_numeric: true,
      custom: function (val) {
        return val == 'male';
      },
      custom2: checkName,
      in_array: [1, 2, 3, 4],
      equals: 'male',
    },
    gg: 'required|number',
    aa: 'required|alpha_numeric',
  },
  function (errors) {
    console.log(errors.errors);
  }
);

module.exports = Validator;

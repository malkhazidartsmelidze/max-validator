# Documentation

- [Instalation](#instalation)
- [Usage](#usage)
- [Extending Validator](#extending-validator)
- [Aviable Validation Rules](#aviable-validation-rules)
- [Use With React.js](#use-with-react.js)
- [Messages](#messages)
- [Change rule splitters](#change-rule-splitters)
- [Contributing](#contributing)
- [License](#license)

## Installation

You can install `max-validator` using npm or yarn package manager:

```bash
npm i max-validator --save
#or
npm install max-validator --save
#or
yarn add max-validator

```

### Usage

```javascript
var V = require('max-validator');

// validate if email is unique
var checkEmail = function (value) {
  if (isUniqueEmail(value)) {
    return true;
  }
  return 'This email is already used';
};

var registerRequestScheme = {
  name: 'required|string|min:2|max:50',
  lastname: 'required|string|min:2|max:50',
  gender: 'required|in_array:male,female',
  accept_policy: 'checked',
  email: [
    'required',
    'email',
    'ends_with:gmail.com',
    checkEmail,
    function (value) {
      // Validate with inline function
      if (isValidEmail(value)) {
        return true;
      }
      return 'Provided email is invalid';
    },
  ],
  address: {
    required: true,
    min: 5,
    max: 50,
    contains_one: ['st', 'str', 'street', '#'],
    mycustom: function (value) {
      if (value !== 'foo') {
        return 'Your address is incorrect';
      }
      return true;
    },
  },
};

var result = Validator.validate(
  {
    name: 'Malkhazi',
    lastname: 'Dartsmeldize',
    email: 'malkhazidartsmelidze@gmail.com',
    gender: 'male',
    accept_policy: 'true',
    address: 'Tbilisi, Georgia',
  },
  registerRequestScheme
);

// Get if validate returned error
result.hasError; // Boolean

// Get errors object
result.errors; // Object

// Get if given field has error
result.isError('name'); // Boolean

// Get if given field has error of given validation rule
result.isError('name', 'max'); // Boolean
result.isError('name', 'mycustom'); // Boolean
// Note: you cant get whether inline function passed validation or not

// Get first validation error message of field
result.getError('name'); // String

// Get all validation error messages of field
result.getError('name', true); // String (joined messages with comma)
```

## Extending Validator

> Validator function must return `true` to make data valid

```javascript
import V from 'max-validator';

V.extend(
  'custom_rule',
  function (value, param1, param2, ...rest) {
    // You can pass as many parameter as you want or use ...spread operator to get array as parameter
    var err = {
      value: value,
    };
    if (value !== 'condition') {
      return true;
    } else {
      return err;
    }
  },
  'Default Error Message: :name cant be :value'
);
// usage: {name: 'custom_rule:val1,val2|required'}
```

## Validation Structure

```javascript
V.validate({
  dataName: 'value here'
}, {
  dataName: 'required|string|in_array:val1,val2',
  withArray: ['required','string', 'in_array:val1,val2'],
  withObject: {
    required: true,
    string: true,
    in_array: ['val1','val2'],
    customRule: function(value){
      // Custom condition here
      if(/* isvalid */){
        return true
      } else {
        return 'This is error string';
      }
    }
  }
})
```

## Aviable Validation Rules

```javascript
/**
 * Validates if given values is `undefined` `null` or empty string.
 * @message Parameter is required
 * @example ...'|required'
 */
'required';

/**
 * Tells validator to pass value in validator function as string
 * @example ...'|string'
 */
'string';

/**
 * Tells validator to pass value in validator function as number
 * @example ...'|number'
 */
'number';

/**
 * Rule for parameter that is not required
 * @example ...'|nullable'
 */
'nullable';

/**
 * Returns error if given value is greater than given parameter, if value is not numeric compares string length
 * @message Parameter cant be less than Value
 * @example ...'|min:20|'
 */
'min';

/**
 * Returns error if given value is less than given parameter, if value is not numeric compares string length
 * @message Parameter cant be greater than Value
 * @example ...'|max:20|'
 */
'max';

/**
 * Returns error if given value is between given parameter, if value is not numeric compares string length
 * @message Parameter must be between From and To
 * @example ...'|between:20,40|'
 */
'between';

/**
 * Validates if checkbox is checked. Valid values: `'on', 1, 'true', true`
 * @message Parameter must be checked
 * @example ...'|checked|'
 */
'checked';

/**
 * Validates if given value is object
 * @message Parameter must be object
 * @example ...'|object|'
 */
'object';

/**
 * Validates if given value is array
 * @message Parameter must be array
 * @example ...'|array|'
 */
'array';

/**
 * Validates if given value is boolean
 * @message Parameter must be boolean
 * @example ...'|boolean|'
 */
'boolean';

/**
 * Validates if given value is valid json
 * @message Parameter must be valid json
 * @example ...'|json|'
 */
'json';

/**
 * Validates if given value contains only digits and letters
 * @message Parameter can only contain digits and letters
 * @example ...'|alpha_numeric|'
 */
'alpha_numeric';

/**
 * Validates if given value contains only digits
 * @message Parameter can only contain numbers
 * @example ...'|numeric|'
 */
'numeric';

/**
 * Validates if given value contains only letters
 * @message Parameter can only contain leters
 * @example ...'|alpha|'
 */
'alpha';

/**
 * Validates if given value contains only letters and dashes
 * @message Parameter can only contain letters and dashes
 * @example ...'|alpha_dash|'
 */
'alpha_dash';

/**
 * Validates if given value is correct email
 * @message Parameter must be correct e-mail
 * @example ...'|email|'
 */
'email';

/**
 * Validates if given value is in given array
 * @message Parameter is invalid
 * @example ...'|in_array:1,2,a,b,c|'
 */
'in_array';

/**
 * Validates if given value is not in given array
 * @message Parameter cant be Value
 * @example ...'|not_in:1,2,a,b,c|'
 */
'not_in';

/**
 * Validates if given value is valid IP Address
 * @message Parameter must be valid ip adress
 * @example ...'|ip|'
 */
'ip';

/**
 * Validates if given value is valid URl
 * @message Parameter must be valid URL
 * @example ...'|url|'
 */
'url';

/**
 * Validates if given value equals to given parameter
 * @message Parameter must equal to Value
 * @example ...'|equals:foo|'
 */
'equals';

/**
 * Validates if given value don't equals to given parameter
 * @message Parameter can't be Value
 * @example ...'|not_equals:foo|'
 */
'not_equals';

/**
 * Validates if given value don't contains one of parameter
 * @message Parameter must contain "Value"
 * @example ...'|contains_one:foo,bar,2|'
 */
'contains_one';

/**
 * Validates if given value don't contains every given parameter
 * @message Parameter must contain "Value"
 * @example ...'|contains_all:foo,bar,2|'
 */
'contains_all';

/**
 * Validates if given value starts with given prefix
 * @message Parameter must start with Value
 * @example ...'|starts_with:foo|'
 */
'starts_with';

/**
 * Validates if given value ends with given suffix
 * @message Parameter must end with Value
 * @example ...'|ends_with:foo|'
 */
'ends_with';

/**
 * Validates if given value is valid date
 * @message Parameter must be valid date
 * @example ...'|date|'
 */
'date';

```

---

### Use with react.js

```javascript
import React from 'react';
import V from 'max-validator';

const registerFormScheme = {
  name: 'required|string|min:2|max:50',
  lastname: 'required|string|min:2|max:50',
  email: 'required|email|max:50',
  gender: 'required|in_array:male,female',
  accept_policy: 'checked',
};

function registerForm(props) {
  const [formState, setFormState] = React.useState({
    isValid: false,
    values: {},
    touched: {},
    errors: V.getEmpty(),
  });

  const handleChange = (event) => {
    event.persist();

    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value,
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true,
      },
    }));
  };

  React.useEffect(() => {
    const errors = V.validate(formState.values, registerFormScheme);

    setFormState((formState) => ({
      ...formState,
      isValid: errors.hasError,
      errors,
    }));
  }, [formState.values]);

  const hasErr = (name) => {
    return formState.touched[name] && formState.errors.isError(name);
  };

  return (
    <form>
      <label htmlFor="name">Name</label>
      <input
        type="text"
        className={hasErr('name') ? 'error' : ''}
        name="name"
        value={formState.values.name}
        onChange={handleChange}
      />

      <label htmlFor="lastname">Last Name</label>
      <input
        type="text"
        className={hasErr('lastname') ? 'error' : ''}
        name="lastname"
        value={formState.values.lastname}
        onChange={handleChange}
      />

      <label htmlFor="lastname">Email</label>
      <input
        type="mail"
        className={hasErr('email') ? 'error' : ''}
        name="email"
        value={formState.values.email}
        onChange={handleChange}
      />

      <label htmlFor="lastname">Gender</label>
      <select
        name="gender"
        className={hasErr('gender') ? 'error' : ''}
        value={formState.values.gender}
        onChange={handleChange}
      >
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <label
        htmlFor="lastname"
        className={hasErr('accept_policy') ? 'error' : ''}
      >
        I accept terms and conditions
      </label>
      <input
        type="checkbox"
        value={formState.values.accept_policy}
        name="accept_policy"
        onChange={handleChange}
      />
    </form>
  );
}
```

## Messages

> You can override or add new message

```javascript
import V from 'max-validator';

/* Override default messages */
V.setMessages({
  required: 'required override message',
  min: 'validator got parameter :min and value :value'
  ...
});

/* Default message is shown when message not found for rule. (usually when rule is custom made) */
V.setDefaultMessage('This is default message');
```

## Change rule separators

```javascript
import V from 'max-validator';

V.setRuleParamSeparator('|');
V.setParamsSeparator(':');
V.setRuleParamSeparator(',');
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)

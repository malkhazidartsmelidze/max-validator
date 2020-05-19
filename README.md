# Documentation
- [Instalation](#instalation)
- [Aviable Validation Rules](#aviable-validation-rules)
- [Writing Own Rules](#writing-own-rules)
- [Usage](#usage)
- [Use With React.js](#use-with-react.js)
- [Messages](#messages)
- [Change rule separators](#change-rule-separators)
- [Contributing](#contributing)
- [License](#license)

## Installation
Useing npm package manager to install `max-validate`.

```bash
npm i max-validate --save
#or 
npm install max-validate --save
```

## Aviable Validation Rules
- [required](#required)
- [string](#string)
- [numeric](#numeric)
- [nullable](#nullable)
- [min](#min)
- [max](#max)
- [between](#between)
- [checked](#checked)
- [object](#object)
- [array](#array)
- [boolean](#boolean)
- [alpha_numeric](#alpha_numeric)
- [alpha](#alpha)
- [email](#email)
- [alpha_dash](#alpha_dash)
- [in_array](#in_array)
- [not_in](#not_in)
- [json](#json)
- [ip](#ip)
- [url](#url)
- [equals](#equals)
- [not_equals](#not_equals)
- [starts_with](#starts_with)
- [ends_with](#ends_with)
- [date](#date)

### required
Validates if given values is `undefined` `null` or empty string. 
> **Parameter is required**
----------------------------------
### string
Tells validator to pass value in validator function as string

----------------------------------
### numeric `(|numeric|)`
Tells validator to pass value in validator function as number

----------------------------------
### nullable `(|nullable|)`
Rule for parameter that is not required

----------------------------------
### min `(|min:20|)`
Returns error if given value is greater than given parameter, if value is not numeric compares string length
> **Parameter cant be less than Value**
----------------------------------
### max `(|max:20|)`
Returns error if given value is less than given parameter, if value is not numeric compares string length
> **Parameter cant be greater than Value**
----------------------------------
### between `(|between:20,40|)`
Returns error if given value is between given parameter, if value is not numeric compares string length
> **Parameter must be between From and To**
----------------------------------
### checked `(|checked|)`
Validates if checkbox is checked. Valid values: `'on', 1, 'true', true`
> **Parameter must be checked**
----------------------------------
### object `(|object|)`
Validates if given value is object
> **Parameter must be object**
----------------------------------
### array `(|array|)`
Validates if given value is array
> **Parameter must be array**
----------------------------------
### boolean `(|boolean|)`
Validates if given value is boolean
> **Parameter must be boolean**
----------------------------------
### json `(|json|)`
Validates if given value is valid json
> **Parameter must be valid json**
----------------------------------
### alpha_numeric `(|alpha_numeric|)`
Validates if given value contains only digits
> **Parameter can only contain numbers**
----------------------------------
### alpha `(|alpha|)`
Validates if given value contains only letters
> **Parameter can only contain leters**
----------------------------------
### alpha_dash `(|alpha_dash|)`
Validates if given value contains only letters and dashes
> **Parameter can only contain letters and dashes**
----------------------------------
### email `(|email|)`
Validates if given value is correct email
> **Parameter must be correct e-mail**
----------------------------------
### in_array `(|in_array:1,2,a,b,c|)`
Validates if given value is in given array
> **Parameter is invalid**
----------------------------------
### not_in `(|not_in:1,2,a,b,c|)`
Validates if given value is not in given array
> **Parameter cant be Value**
----------------------------------
### ip `(|ip|)`
Validates if given value is valid IP Address
> **Parameter must be valid ip adress**
----------------------------------
### url `(|url|)`
Validates if given value is valid URl
> **Parameter must be valid URL**
----------------------------------
### equals `(|equals:foo|)`
Validates if given value equals to given parameter
> **Parameter must equal to Value**
----------------------------------
### not_equals `(|not_equals:bar|)`
Validates if given value don't equals to given parameter
> **Parameter can't be Value**
----------------------------------
### starts_with `(|starts_with:foo|)`
Validates if given value starts with given prefix
> **Parameter must start with Value**
----------------------------------
### ends_with `(|ends_with:foo|)`
Validates if given value ends with given suffix
> **Parameter must end with Value**
----------------------------------
### date `('date')`
Validates if given value is valid date
> **Parameter must be valid date**
----------------------------------




### Usage

```javascript
var V = require('max-validate');

var registerRequest = {
  name: 'required|string|min:2|max:50',
  lastname: 'required|string|min:2|max:50',
  email: 'required|email|max:50',
  gender: 'required|in_array:male,female',
  accept_policy: 'checked',
};

var data = {
  name: 'Malkhazi',
  lastname: 'Dartsmeldize',
  email: 'malkhazidartsmelidze@gmail.com',
  gender: 'male',
  accept_policy: 'true'
};

var result = V.validate(data, registerRequest);

// Get if validate returned error
result.hasError; // Boolean

// Get errors object
result.errors; // Object

// Get if given field has error
result.isError('name'); // Boolean

// Get if given field has error of given validation rule
result.isError('name', 'max'); // Boolean

// Get first validation error message of field
result.getError('name'); // String

// Get all validation error messages of field
result.getError('name', true); // String (joined messages with comma)
```

### Use with react.js
```javascript
import React from 'react'
import V from 'max-validate'

const registerFormScheme = {
  name: 'required|string|min:2|max:50',
  lastname: 'required|string|min:2|max:50',
  email: 'required|email|max:50',
  gender: 'required|in_array:male,female',
  accept_policy: 'checked',
};

function registerForm(props){
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
          event.target.type === 'checkbox' ? event.target.checked : event.target.value,
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true,
      },
    }));
  };

  React.useEffect(() => {
    const errors = V.validate(formState.values, scheme);

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
      <label htmlFor='name'>Name</label>
      <input type='text' className={hasErr('name') ? 'error' : ''} name='name' value={formState.values.name} onChange={handleChange} />

      <label htmlFor='lastname'>Last Name</label>
      <input type='text' className={hasErr('lastname') ? 'error' : ''} name='lastname' value={formState.values.lastname} onChange={handleChange} />

      <label htmlFor='lastname'>Email</label>
      <input type='mail' className={hasErr('email') ? 'error' : ''} name='email' value={formState.values.email} onChange={handleChange} />

      <label htmlFor='lastname'>Gender</label>
      <select name='gender' className={hasErr('gender') ? 'error' : ''} value={formState.values.gender} onChange={handleChange} >
        <option value='male'>Male</option>
        <option value='female'>Female</option>
      </select>

      <label htmlFor='lastname' className={hasErr('accept_policy') ? 'error' : ''}>
        I accept terms and conditions
      </label>
      <input type='checkbox' value={formState.values.accept_policy} name='accept_policy' onChange={handleChange} />
    </form>
  )
}
```


## Writing Own Rules (extending)

> Validator function must return `true` to make data valid 

### Custom rule without parameter:
```javascript
import V from 'max-validate';

V.extend('custom_rule', function(value){
  var err = {
    value: value
  };
  if(value !== 'condition') {
    return true;
  } else {
    return err;
  }
},'Default Error Message: :name cant be :value');
// usage: {name: 'custom_rule|required'}
```

### Custom rule with one parameter:
```javascript
import V from 'max-validate';

V.extend('custom_rule', function(value, param){
  var err = {
    value: value
  };
  if(value !== param) {
    return true;
  } else {
    return err;
  }
},'Default Error Message: :name cant be :value');
// usage: {name: 'custom_rule:20|required'}
```

### Custom rule with multiple patameters:
```javascript
import V from 'max-validate';

V.extend('custom_rule', function(value, param1, param2, param3, ...rest){
  var err = {
    value: value,
    param1: param1,
    param2: param2,
  };
  if(param1 && param2 && value) {
    return true;
  } else {
    return err;
  }
},'Default Error Message: :name cant be :param1 or :param2');
// usage: {name: 'custom_rule:20,22,34,56,44,foo,bar|min:40|required'}
```

## Messages
> You can override or add new message
```javascript
import V from 'max-validate';

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
import V from 'max-validate';

V.setRuleParamSeparator('|');
V.setParamsSeparator(':');
V.setRuleParamSeparator(',');
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


## License
[MIT](https://choosealicense.com/licenses/mit/)

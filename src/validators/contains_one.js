export default function (value, ...values) {
  var err = {
    value_to_contain: values.join(','),
  };

  if (!Array.isArray(value)) {
    value = String(value);
  }

  for (var i = 0, l = values.length; i < l; i++) {
    if (value.indexOf(values[i]) > -1) {
      return true;
    }
  }

  return err;
}

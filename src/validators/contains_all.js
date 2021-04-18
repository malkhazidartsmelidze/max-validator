export default function (value, ...values) {
  if (!Array.isArray(value)) {
    value = String(value);
  }

  for (var i = 0, l = values.length; i < l; i++) {
    if (value.indexOf(values[i]) == -1) {
      var err = {
        value_to_contain: values[i],
      };

      return err;
    }
  }

  return true;
}

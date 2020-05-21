module.exports = function (value, value_to_contain) {
  var err = {
    value_to_contain: value_to_contain,
  };

  if (Array.isArray(value) && value.indexOf(value_to_contain) > -1) {
    return true;
  }

  if (String(value).indexOf(value_to_contain) > -1) {
    return true;
  }

  return err;
};

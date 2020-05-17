module.exports = function (value, min) {
  var err = {
    min: min,
  };

  if (typeof value == 'string') {
    if (value.length >= min) return true;
  } else if (typeof value !== undefined) {
    if (value >= min) return true;
  }

  return err;
};

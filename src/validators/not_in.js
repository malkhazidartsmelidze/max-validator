module.exports = function (value, ...arr) {
  var err = {
    value: value,
  };

  if (arr.indexOf(String(value)) === -1) {
    return true;
  }

  return err;
};

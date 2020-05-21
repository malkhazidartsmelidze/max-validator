module.exports = function (value) {
  var err = {
    value: value,
  };

  if (/^\d+$/.test(value)) {
    return true;
  }

  return err;
};

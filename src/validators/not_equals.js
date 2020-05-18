module.exports = function (value, param) {
  var err = {
    value: param,
  };

  if (String(value) != param) {
    return true;
  }

  return err;
};

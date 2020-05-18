module.exports = function (value, ...arr) {
  var err = {
    value: arr.join(','),
  };

  if (arr.indexOf(String(value)) > -1) {
    return true;
  }

  return err;
};

module.exports = function (value) {
  var err = {};

  if (value == 1 || value == 'on' || value == true || value == 'true') {
    return true;
  }

  return err;
};

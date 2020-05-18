module.exports = function (value) {
  var err = {};

  try {
    new URL(value);
  } catch (e) {
    return err;
  }

  return true;
};

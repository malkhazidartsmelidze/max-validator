module.exports = function (value) {
  var err = {};

  if (typeof value !== 'boolean') {
    return err;
  }

  return true;
};

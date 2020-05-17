module.exports = function (value, from, to) {
  var err = {
    from: from,
    to: to,
    value: value,
  };

  if (typeof value === 'string') {
    if (value.length >= from && value.length <= to) {
      return true;
    }
  } else {
    if (value >= from && value <= to) {
      return true;
    }
  }

  return err;
};

var required = require('./required');

module.exports = function (rules, value, from, to) {
  try {
    if (rules.isString && value) {
      return value.length >= from && value.length <= to;
    }

    return value >= from && value <= to;
  } catch (err) {
    return false;
  }
};

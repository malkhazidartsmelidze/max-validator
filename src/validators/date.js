export default function (value) {
  var err = {};

  if (Date.parse(value) !== NaN) {
    return true;
  }

  return err;
}

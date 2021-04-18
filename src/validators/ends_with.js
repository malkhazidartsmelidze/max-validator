export default function (value, suffix) {
  var err = {
    suffix: suffix,
  };

  suffix = String(suffix);
  value = String(value);

  if (value.indexOf(suffix, value.length - suffix.length) !== -1) {
    return true;
  }

  return err;
}

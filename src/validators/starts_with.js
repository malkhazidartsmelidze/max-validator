export default function (value, prefix) {
  var err = {
    prefix: prefix,
  };

  prefix = String(prefix);
  value = String(value);

  if (value.indexOf(prefix) !== 0) {
    return err;
  }

  return true;
}

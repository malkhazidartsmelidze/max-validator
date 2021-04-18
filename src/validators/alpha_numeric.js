export default function (value) {
  var err = {
    value: value,
  };

  if (/^[A-Za-z0-9]+$/.test(value)) {
    return true;
  }

  return err;
}

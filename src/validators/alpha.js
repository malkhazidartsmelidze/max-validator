export default function (value) {
  var err = {
    value: value,
  };

  if (/^[a-zA-Z]+$/.test(value)) {
    return true;
  }

  return err;
}

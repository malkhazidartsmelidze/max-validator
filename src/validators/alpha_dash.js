export default function (value) {
  var err = {
    value: value,
  };

  if (/^[A-Za-z\-]+$/.test(value)) {
    return true;
  }

  return err;
}

export default function (value, max) {
  var err = {
    max: max,
  };

  if (typeof value == 'string') {
    if (value.length <= max) return true;
  } else if (typeof value !== undefined) {
    if (value <= max) return true;
  }

  return err;
}

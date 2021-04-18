export default function (value) {
  var err = {};

  try {
    JSON.parse(String(value));

    return true;
  } catch (e) {
    return err;
  }
}

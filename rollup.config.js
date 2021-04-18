export default {
  input: 'index.js',
  output: [
    {
      file: 'dist/max-validator.js',
      format: 'cjs',
    },
    {
      file: 'dist/max-validator.mjs',
      format: 'es',
    },
  ],
};

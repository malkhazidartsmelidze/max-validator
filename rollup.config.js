import { uglify } from 'rollup-plugin-uglify';

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
  plugins: [uglify()],
};

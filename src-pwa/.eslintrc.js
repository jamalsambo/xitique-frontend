const { resolve } = require('path');

module.exports = {
  parserOptions: {
    project: resolve(__dirname, './tsconfig.json'),
  },

  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
      env: {
        serviceworker: true,
      },
    },
  ],
};

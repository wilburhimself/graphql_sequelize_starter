// ESLint v9+ flat config (CommonJS)
const tseslint = require('typescript-eslint');
const prettier = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'node_modules/**',
      '.eslintrc.cjs',
      'src/**/*.js',
    ],
  },
  // Only apply TS rules to TS files
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  // Allow CommonJS in this config file
  {
    files: ['eslint.config.js'],
    rules: {
      'no-undef': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  prettier,
];

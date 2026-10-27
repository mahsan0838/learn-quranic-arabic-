const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['node_modules/*', 'dist/*', '.expo/*'],
  },
  {
    // Node's built-in test runner files.
    files: ['tests/**/*.js'],
    languageOptions: { sourceType: 'module' },
  },
]);

const testRulesOverrides = {
  // allow chai parenthesis-less calls (e.g., to.be.undefined)
  'no-unused-expressions': 'off',
  // allow nesting tests suite
  'max-nested-callbacks': 'off',
  // handly for readable mocks
  '@typescript-eslint/no-non-null-assertion': 'off',
}

module.exports = {
  extends: ['@contentful/eslint-config-backend-typescript', 'plugin:prettier/recommended'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  rules: {
    // Fights with prettier config
    '@typescript-eslint/indent': 'off',
    'mocha/no-exclusive-tests': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  ignorePatterns: ['built', 'node_modules'],
  overrides: [
    {
      files: '*.spec.ts',
      rules: testRulesOverrides,
    },
    {
      files: 'test/**/*',
      rules: testRulesOverrides,
    },
  ],
}
module.exports = {
  env: {
    es6: true,
    node: true,
  },
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'jest'],
  extends: [
    'standard-with-typescript',
    'prettier',
    'plugin:jest/recommended',
    'plugin:jest/style',
  ],
}

module.exports = {
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  globals: {
    jskGames: 'readonly',
    Fuse: 'readonly',
    gtag: 'readonly',
  },
  rules: {
    'no-console': 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-plusplus': 'off',
    'no-param-reassign': 'off',
    'no-use-before-define': ['error', { functions: false, classes: true, variables: false }],
    'func-names': 'off',
    'prefer-arrow-callback': 'off',
    'no-return-assign': 'off',
    'unicode-bom': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.test.js', '**/*.spec.js'] },
    ],
  },
  overrides: [
    {
      files: ['sw.js'],
      env: {
        serviceworker: true,
      },
      rules: {
        'no-restricted-globals': 'off',
        'arrow-body-style': 'off',
      },
    },
    {
      files: ['scripts/games.js'],
      rules: {
        'no-unused-vars': 'off',
      },
    },
  ],
};

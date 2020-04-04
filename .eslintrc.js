module.exports = {
  parser: 'babel-eslint',
  rules: {
    complexity: ['warn', {'max': 20}],
    indent: ['warn', 2, {'SwitchCase': 1}],
    'linebreak-style': ['warn', 'unix'],
    'max-depth': ['warn', {'max': 4}],
    'max-len': ['warn', {'code': 120, 'tabWidth': 2}],
    'no-console': [
      'error',
      {
        allow: ['warn', 'error', 'info']
      }
    ],
    quotes: ['warn', 'single'],
    semi: ['warn', 'always'],
    'no-shadow': [
      'error', 
      { 
        builtinGlobals: false, 
        hoist: 'functions', 
        allow: [] 
      }
    ]
  },
  env: {
    browser: true,
    node: false
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  globals: {
    __DEV__: true,
    __REDUX_DEVTOOLS__: true,
    $: true
  },
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true
    }
  },
  plugins: [
    'react'
  ]
}

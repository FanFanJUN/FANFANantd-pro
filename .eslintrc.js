module.exports = {
  parser: 'babel-eslint',
  extends: [ 'plugin:compat/recommended', 'prettier', 'airbnb' ], // airbnb在最前面eslint不生效
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    jest: true,
    jasmine: true,
  },
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true, // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
    // page: false,
  },
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js'] }],
    'react/jsx-wrap-multilines': 0,
    'react/prop-types': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-one-expression-per-line': 0,
    'import/no-unresolved': [2, { ignore: ['^@/', '^umi/', '^react-admin-components'] }],
    'import/no-extraneous-dependencies': [
      2,
      {
        optionalDependencies: true,
        devDependencies: ['**/tests/**.js', '/mock/**/**.js', '**/**.test.js'],
      },
    ],
    'import/no-cycle': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'linebreak-style': 0,
    'consistent-style': 0, // return后面是否允许省略
    'object-curly-newline': 0,
    'implicit-arrow-linebreak': 0,
    'no-plusplus': 0, // 禁止使用++||--
    'lines-between-class-members': 0,
    'generator-star-spacing': 0,
    'no-else-return': 0,
    'operator-linebreak': 0,
    'no-mixed-operators': 0,
    'arrow-parens': 0,
    'arrow-body-style': 0,
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore',
      }
    ]
  },
  settings: {
    polyfills: ['fetch', 'promises', 'url', 'object-assign'],
  },
};

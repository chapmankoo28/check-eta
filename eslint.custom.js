export const customRules = [
  {
    rules: {
      'guard-for-in': 2,
      'no-caller': 2,
      'no-extend-native': 2,
      'no-extra-bind': 2,
      'no-invalid-this': 2,
      'no-multi-spaces': 2,
      'no-multi-str': 2,
      'no-new-wrappers': 2,
      'no-throw-literal': 2,
      'no-with': 2,
      'prefer-promise-reject-errors': 2,
      'no-unused-vars': [2, { args: 'none' }],
      'array-bracket-newline': 0,
      'array-bracket-spacing': [2, 'never'],
      'array-element-newline': 0,
      'block-spacing': [2, 'never'],
      'brace-style': 2,
      'comma-dangle': [2, 'always-multiline'],
      'comma-spacing': 2,
      'comma-style': 2,
      'computed-property-spacing': 2,
      camelcase: [2, { properties: 'never' }],
      'eol-last': 2,
      'func-call-spacing': 2,
      indent: [
        2,
        2,
        {
          CallExpression: {
            arguments: 2
          },
          FunctionDeclaration: {
            body: 1,
            parameters: 2
          },
          FunctionExpression: {
            body: 1,
            parameters: 2
          },
          MemberExpression: 2,
          ObjectExpression: 1,
          SwitchCase: 1,
          ignoredNodes: ['ConditionalExpression']
        }
      ],
      'key-spacing': 2,
      'keyword-spacing': 2,
      'linebreak-style': 2,
      'max-len': [
        2,
        {
          code: 100,
          tabWidth: 2,
          ignoreUrls: true
        }
      ],
      'new-cap': 2,
      'no-array-constructor': 2,
      'no-mixed-spaces-and-tabs': 2,
      'no-multiple-empty-lines': [2, { max: 2 }],
      'no-new-object': 2,
      'no-tabs': 2,
      'no-trailing-spaces': 2,
      'object-curly-spacing': 2,
      'one-var': [
        2,
        {
          var: 'never',
          let: 'never',
          const: 'never'
        }
      ],
      'operator-linebreak': [2, 'after'],
      'quote-props': [2, 'consistent'],
      quotes: [2, 'single', { allowTemplateLiterals: true }],
      semi: 2,
      'semi-spacing': 2,
      'space-before-blocks': 2,
      'space-before-function-paren': [
        2,
        {
          asyncArrow: 'always',
          anonymous: 'never',
          named: 'never'
        }
      ],
      'spaced-comment': [2, 'always'],
      'switch-colon-spacing': 2,
      'arrow-parens': [2, 'always'],
      'constructor-super': 2,
      'generator-star-spacing': [2, 'after'],
      'no-new-symbol': 2,
      'no-this-before-super': 2,
      'no-var': 2,
      'prefer-const': [2, { destructuring: 'all' }],
      'prefer-rest-params': 2,
      'rest-spread-spacing': 2,
      'yield-star-spacing': [2, 'after'],
      'prefer-spread': 2
    }
  }
];

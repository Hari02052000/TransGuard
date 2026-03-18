import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['node_modules', 'dist', 'coverage'],
  },

  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: globals.node,
    },

    rules: {
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',

      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-var': 'error',
      'prefer-const': 'error',

      'padding-line-between-statements': [
        'error',

        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'any', prev: 'import', next: 'import' },

        { blankLine: 'always', prev: '*', next: 'return' },

        { blankLine: 'always', prev: 'block', next: '*' },
        { blankLine: 'always', prev: '*', next: 'block' },

        { blankLine: 'always', prev: ['const', 'let', 'var'], next: 'function' },

        { blankLine: 'always', prev: 'function', next: 'function' },
      ],

      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off', 
    },

    extends: ['js/recommended'],
  },

  ...tseslint.configs.recommended,

  prettier,
]);
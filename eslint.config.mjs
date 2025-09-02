import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginPrettier from 'eslint-plugin-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Next.js + TS recommended
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Prettier recommended (turns Prettier issues into ESLint errors and disables conflicts)
  ...compat.extends('plugin:prettier/recommended'),

  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],

    // Flat config needs you to provide plugins explicitly
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      import: eslintPluginImport,
      prettier: eslintPluginPrettier,
    },

    rules: {
      /**
       * —— IMPORT ORDER (React/Next first, directly under "use client") ——
       */
      'import/first': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // fs, path
            'external', // react, next, node_modules
            'internal', // @/**
            ['parent', 'sibling', 'index'],
            'type',
          ],
          pathGroups: [
            { pattern: 'react', group: 'external', position: 'before' },
            { pattern: 'next', group: 'external', position: 'before' },
            { pattern: 'next/**', group: 'external', position: 'before' },
            { pattern: '@/**', group: 'internal', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      // Blank line after directive prologue (keeps a neat gap after "use client")
      'lines-around-directive': ['error', { before: 'never', after: 'always' }],

      /**
       * —— NO TERNARY (prefer if/else) ——
       */
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ConditionalExpression',
          message: 'Ternary expressions are disallowed. Use if/else statements for clarity.',
        },
      ],

      /**
       * —— NO `any` ——
       */
      '@typescript-eslint/no-explicit-any': [
        'error',
        { fixToUnknown: true, ignoreRestArgs: false },
      ],

      /**
       * —— NO CIRCULAR DEPENDENCIES ——
       */
      'import/no-cycle': ['error', { maxDepth: 1 }],
      'import/no-self-import': 'error',
      'import/no-duplicates': 'error',

      /**
       * —— PRETTIER —— (optional but useful if you want ESLint to show formatting errors)
       */
      'prettier/prettier': 'error',
    },
  },
];

export default eslintConfig;

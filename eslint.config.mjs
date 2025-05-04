// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { flatConfigs as importPluginFlatConfigs } from 'eslint-plugin-import';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import pluginRouter from '@tanstack/eslint-plugin-router'
// import moonPlugin from 'eslint-config-moon';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  ...pluginRouter.configs['flat/recommended'],
  eslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      importPluginFlatConfigs.recommended,
      importPluginFlatConfigs.typescript,
    ],
    // other configs...
  },
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import/resolver': {
        // You will also need to install and configure the TypeScript resolver
        // See also https://github.com/import-js/eslint-import-resolver-typescript#configuration
        typescript: true,
        node: true,
      },

      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`

          // bun: true, // resolve Bun modules https://github.com/import-js/eslint-import-resolver-typescript#bun

          // Choose from one of the "project" configs below or omit to use <root>/tsconfig.json or <root>/jsconfig.json by default

          // use <root>/path/to/folder/tsconfig.json or <root>/path/to/folder/jsconfig.json
          // project: 'path/to/folder',

          // Multiple tsconfigs/jsconfigs (Useful for monorepos, but discouraged in favor of `references` supported)

          // use a glob pattern
          project: [
            'tsconfig.json',
            'apps/*/tsconfig.json',
            'pkgs/*/tsconfig.json'
          ],

          // use an array
          // project: [
          //   'packages/module-a/tsconfig.json',
          //   'packages/module-b/jsconfig.json',
          // ],

          // use an array of glob patterns
          // project: [
          //   'packages/*/tsconfig.json',
          //   'other-packages/*/jsconfig.json',
          // ],
        }),
      ],
    },
  },
  {
    rules: {
      'no-unused-vars': 'off',
      "import/no-unresolved": "off",
      "@typescript-eslint/consistent-type-imports": "error",
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/only-throw-error': 'warn',
      'import/order': [
        'error',
        {
          pathGroups: [
            {
              pattern: ':**',
              group: 'parent',
              position: 'after',
            },
            {
              pattern: '@dayzserver/*',
              group: 'internal',
              position: 'after',
            },
          ],
          "groups": ["builtin", "external", "internal", "parent", "sibling", "index",  "type",],
          "newlines-between": "always",
          "alphabetize": { "order": "asc" }
        },
      ],
    },
  },
  {
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
  },
);

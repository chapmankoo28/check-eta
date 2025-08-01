import eslintReact from '@eslint-react/eslint-plugin';
import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { customRules } from './eslint.custom.js';

export default tseslint.config(
  { ignores: ['**/node_modules/*', '**/dist/*'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintReact.configs.recommended,
  {
    plugins: {
      'react-hooks': reactHooks
    },
    rules: {
      ...reactHooks.configs['recommended-latest'].rules
    }
  },
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      parserOptions: {
        project: true,
      },
      globals: {
        ...globals.browser
      }
    }
  },
  ...tseslint.config({
    files: ['src/**/*.{ts,tsx}'],
    extends: tseslint.configs.strictTypeChecked,
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname
      },
      globals: {
        ...globals.browser
      }
    }
  }),
  ...customRules,
  eslintConfigPrettier
);
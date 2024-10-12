import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import ts from 'typescript-eslint';

export default ts.config(
  pluginJs.configs.recommended,
  ...ts.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**!/!*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        Potree: 'readonly',
      },
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  },
);

/*
export default [{
  files: ["**!/!*.{js,mjs,cjs,ts}"]
  }, {
    languageOptions: {
      globals: {
        ...globals.browser,
        Potree: "readonly"
      }
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    files: ["**!/!*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser
      }
    }
  },
];*/

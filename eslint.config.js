const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  js.configs.recommended,
  {
    rules: {
      "no-unused-labels": "error",
      "no-unused-vars": "error",
      "no-duplicate-imports": "error",
    },

    languageOptions: {
      ecmaVersion: 2018,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
  },
];

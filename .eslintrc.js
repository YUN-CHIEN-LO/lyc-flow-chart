module.exports = {
    root: true,
    env: {
      node: true,
    },
    extends: [
      "plugin:jsdoc/recommended",
      "plugin:vue/recommended",
      "eslint:recommended",
      "@vue/prettier",
    ],
    parserOptions: {
      parser: "@babel/eslint-parser",
    },
    rules: {
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-unused-vars": "off",
      "jsdoc/require-returns-description": "off",
      "vue/valid-v-slot": [
        "error",
        {
          allowModifiers: true,
        },
      ],
      "no-useless-escape": 0,
    },
    overrides: [
      {
        files: ["**/__tests__/*.{j,t}s?(x)", "**/tests/**/*.spec.{j,t}s?(x)"],
        env: {
          jest: true,
        },
      },
    ],
  };
  
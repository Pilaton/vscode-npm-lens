/** @type { import("eslint").Linter.BaseConfig } */

module.exports = {
  env: {
    browser: true,
    es2023: true,
    node: true,
  },
  extends: [
    "airbnb",
    "plugin:react/recommended",
    "plugin:unicorn/recommended",
    "prettier",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
    {
      extends: [
        "airbnb",
        "airbnb-typescript",
        "plugin:react/jsx-runtime",
        "prettier",
      ],
      files: ["*.ts", "*.tsx"],
      rules: {
        "import/order": [
          "warn",
          {
            groups: [
              "builtin",
              "external",
              "internal",
              "parent",
              "sibling",
              "index",
              "object",
              "type",
            ],
            "newlines-between": "always",
            distinctGroup: true,
            pathGroupsExcludedImportTypes: ["builtin"],
            alphabetize: { order: "asc", caseInsensitive: true },
          },
        ],
        "react/require-default-props": "off",
        "unicorn/no-array-for-each": "off",
        "unicorn/no-null": "off",
        "unicorn/no-array-reduce": "off",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: true,
  },
  plugins: ["react", "unicorn", "prettier"],
  rules: {
    "unicorn/prefer-module": "off",
  },
};

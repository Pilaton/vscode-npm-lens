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
      files: [".eslintrc.{js,cjs}"],
      env: {
        node: true,
      },
      parserOptions: {
        sourceType: "script",
      },
    },
    {
      files: ["*.ts", "*.tsx"],
      extends: [
        "airbnb",
        "airbnb-typescript",
        "airbnb/hooks",
        "plugin:@typescript-eslint/recommended-type-checked", // @typescript-eslint @v6
        "plugin:@typescript-eslint/stylistic-type-checked", // @typescript-eslint @v6
        "plugin:react/jsx-runtime",
        "plugin:unicorn/recommended",
        "prettier",
      ],
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
        "@typescript-eslint/consistent-type-imports": [
          "error",
          {
            fixStyle: "inline-type-imports",
          },
        ],
        "@typescript-eslint/no-floating-promises": "off",
        "react/require-default-props": "off",
        "unicorn/no-array-for-each": "off",
        "unicorn/no-null": "off",
        "unicorn/no-array-reduce": "off",
        "class-methods-use-this": "off",
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

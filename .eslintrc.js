module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["airbnb", "plugin:react/recommended", "prettier"],
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
        "react/require-default-props": "off",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: true,
  },
  plugins: ["react", "prettier"],
  rules: {},
};

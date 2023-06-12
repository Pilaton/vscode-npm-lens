/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */

// @ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig * */

const path = require("path");

const webpack = require("webpack");

const banner = `
npmLens
@file Control panel for your project's dependencies.
@author Pilaton <dev@pilaton.com>
@see {@link https://github.com/Pilaton/npmLens|GitHub}
`;

/** @type import('webpack').RuleSetRule[] */
const commonRules = [
  {
    test: /\.(ts|tsx)$/,
    exclude: /node_modules/,
    use: {
      loader: "ts-loader",
      options: { transpileOnly: true },
    },
  },
  {
    test: /\.svg$/i,
    issuer: /\.[jt]sx?$/,
    use: ["@svgr/webpack"],
  },
];

/** @type WebpackConfig */
module.exports = {
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".jsx"],
  },
  module: {
    rules: commonRules,
  },
  plugins: [
    new webpack.BannerPlugin({
      banner,
    }),
  ],
  externals: {
    vscode: "commonjs vscode",
  },
};

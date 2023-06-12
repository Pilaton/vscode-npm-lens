/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig * */

const path = require("path");

/** @type Partial<WebpackConfig> */
const commonProd = {
  mode: "production",
  extends: path.resolve(__dirname, "./webpack.common.js"),
  devtool: false,
};

/** @type WebpackConfig[] */
module.exports = [
  {
    name: "WebView",
    target: "web",
    entry: "./src/webview/webview.tsx",
    output: {
      filename: "webview.js",
    },
    optimization: {
      nodeEnv: "production",
    },
    ...commonProd,
  },
  {
    name: "TreeView",
    target: "node",
    entry: "./src/extension.ts",
    output: {
      filename: "extension.js",
      libraryTarget: "commonjs2",
    },
    infrastructureLogging: {
      level: "log",
    },
    ...commonProd,
  },
];

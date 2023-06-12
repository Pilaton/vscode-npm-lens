/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig * */

const path = require("path");

/** @type Partial<WebpackConfig> */
const commonDev = {
  mode: "development",
  extends: path.resolve(__dirname, "./webpack.common.js"),
  devtool: "source-map",
};

/** @type WebpackConfig[] */
module.exports = [
  {
    name: "WebView",
    target: "web",
    entry: "./src/webview/webview.tsx",
    output: {
      filename: "webview.js",
      devtoolModuleFilenameTemplate: "../[resource-path]",
    },
    ...commonDev,
  },
  {
    name: "TreeView",
    target: "node",
    entry: "./src/extension.ts",
    output: {
      filename: "extension.js",
      libraryTarget: "commonjs2",
      devtoolModuleFilenameTemplate: "../[resource-path]",
    },
    ...commonDev,
  },
];

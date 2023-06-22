import { BundleSizesDataAsync } from "../../types/bundleSizes";

import BaseProvider from "./base-provider";

interface IBundlePHResponse {
  gzip: number;
  size: number;
  dependencyCount: number;
  url: string;
}

const CONFIG = {
  url: "https://bundlephobia.com/api/size?package=",
  exceptions: [
    "^@types/",
    "^webpack-cli$",
    "^next$",
    "^eslint-config-next$",
    "^firebase",
  ],
  errorText: "«Bundlephobia»: failed to get dependency size: ",
};
const regex = new RegExp(CONFIG.exceptions.join("|"));

class BundlePHProvider extends BaseProvider {
  // eslint-disable-next-line class-methods-use-this
  async fetchBundleInfo(packageName: string): BundleSizesDataAsync {
    if (regex.test(packageName)) return null;

    try {
      const response = await fetch(`${CONFIG.url}${packageName}`);
      const parsedData = (await response.json()) as IBundlePHResponse;

      return {
        gzip: parsedData.gzip,
        size: parsedData.size,
        dependencyCount: parsedData.dependencyCount,
        url: `https://bundlephobia.com/package/${packageName}`,
      };
    } catch (err) {
      // window.vscode.postMessage({
      //   type: "error",
      //   text: CONFIG.errorText + packageName,
      // });
      return null;
    }
  }
}

export default BundlePHProvider;

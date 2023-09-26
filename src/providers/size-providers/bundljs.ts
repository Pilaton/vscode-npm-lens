import { BundleSizesDataAsync } from "../../types/bundleSizes";

import BaseProvider from "./base-provider";

interface IBundleJSResponse {
  size: {
    rawUncompressedSize: number;
    rawCompressedSize: number;
  };
}

const CONFIG = {
  url: "https://deno.bundlejs.com/?q=",
  errorText: "«BundleJS» domain not available",
};

class BundleJSProvider extends BaseProvider {
  // eslint-disable-next-line class-methods-use-this
  async fetchBundleInfo(packageName: string): BundleSizesDataAsync {
    try {
      const response = await fetch(`${CONFIG.url}${packageName}`);
      const parsedData = (await response.json()) as IBundleJSResponse;

      return {
        gzip: parsedData.size.rawCompressedSize,
        size: parsedData.size.rawUncompressedSize,
      };
    } catch (err) {
      window.vscode.postMessage({
        type: "error",
        text: CONFIG.errorText,
      });
      return null;
    }
  }
}

export default BundleJSProvider;

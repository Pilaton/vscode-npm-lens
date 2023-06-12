import { Dependencies } from "../types/global";

interface IBundlephobiaResponse {
  gzip: number;
  size: number;
  dependencyCount: number;
  url: string;
}

export type BundleData = IBundlephobiaResponse;

export type BundleDataAsync = Promise<BundleData | null>;

/* -------------------------------------------------------------------------- */

class Bundlephobia {
  private bundles: Record<string, BundleDataAsync> = {};

  constructor(deps: Dependencies) {
    this.init(deps);
  }

  private init(packages: Dependencies) {
    Object.keys(packages).forEach((packageName) => {
      this.bundles[packageName] = Bundlephobia.getBundleInfo(packageName);
    });
  }

  private static async getBundleInfo(packageName: string): BundleDataAsync {
    try {
      const response = await fetch(
        `https://bundlephobia.com/api/size?package=${packageName}`
      );

      const parsedData = (await response.json()) as IBundlephobiaResponse;

      return {
        gzip: parsedData.gzip,
        size: parsedData.size,
        dependencyCount: parsedData.dependencyCount,
        url: `https://bundlephobia.com/package/${packageName}`,
      };
    } catch (err) {
      window.vscode.postMessage({
        type: "error",
        text: "«Bundlephobia» domain not available",
      });
      return null;
    }
  }

  async getBundleData(packageName: string): BundleDataAsync {
    return this.bundles[packageName];
  }

  getDataAllBundles(): Record<string, BundleDataAsync> {
    return this.bundles;
  }
}
export default Bundlephobia;

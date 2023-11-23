import { type BundleSizesDataAsync } from "../../types/bundleSizes";
import { type Dependencies } from "../../types/global";

type IBundleSizeProvider = {
  fetchBundleInfo(packageName: string): BundleSizesDataAsync;
  getBundleData(packageName: string): BundleSizesDataAsync;
  getDataAllBundles(): Record<string, BundleSizesDataAsync>;
};

abstract class BaseProvider implements IBundleSizeProvider {
  protected bundles: Record<string, BundleSizesDataAsync> = {};

  constructor(deps: Dependencies) {
    this.init(deps);
  }

  private init(packages: Dependencies) {
    Object.keys(packages).forEach((packageName) => {
      this.bundles[packageName] = this.fetchBundleInfo(packageName);
    });
  }

  abstract fetchBundleInfo(packageName: string): BundleSizesDataAsync;

  async getBundleData(packageName: string): BundleSizesDataAsync {
    return this.bundles[packageName];
  }

  getDataAllBundles(): Record<string, BundleSizesDataAsync> {
    return this.bundles;
  }
}

export default BaseProvider;

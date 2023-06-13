import { create } from "zustand";

import { PackageDataAsync } from "../providers/npm-provider";
import { BundleSizesDataAsync } from "../types/bundleSizes";

export type PackagesState = Record<string, PackageDataAsync>;
export type BundlesState = Record<string, BundleSizesDataAsync>;

type State = {
  packages: PackagesState;
  bundles: BundlesState;
};

type Action = {
  setPackages: (packages: PackagesState) => void;
  setBundles: (bundles: BundlesState) => void;
};

/* -------------------------------------------------------------------------- */

const useStore = create<State & Action>()((set) => ({
  packages: {},
  bundles: {},
  setPackages: (packages) => set((state) => ({ ...state, packages })),
  setBundles: (bundles) => set((state) => ({ ...state, bundles })),
}));

export default useStore;

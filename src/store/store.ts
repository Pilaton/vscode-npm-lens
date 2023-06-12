import { create } from "zustand";

import { BundleDataAsync } from "../services/bundlephobia.controller";
import { PackageDataAsync } from "../services/npm.controller";

export type PackagesState = Record<string, PackageDataAsync>;
export type BundlesState = Record<string, BundleDataAsync>;

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

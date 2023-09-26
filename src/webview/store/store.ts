import { create } from "zustand";

import { PackageDataAsync } from "../../providers/npm-provider";
// import { BundleSizesDataAsync } from "../../types/bundleSizes"; // TODO: size-provider is off

export type PackagesState = Record<string, PackageDataAsync>;
// export type BundlesState = Record<string, BundleSizesDataAsync>; // TODO: size-provider is off

type State = {
  packages: PackagesState;
  // bundles: BundlesState; // TODO: size-provider is off
};

type Action = {
  setPackages: (packages: PackagesState) => void;
  // setBundles: (bundles: BundlesState) => void; // TODO: size-provider is off
};

/* -------------------------------------------------------------------------- */

const useStore = create<State & Action>()((set) => ({
  packages: {},
  // bundles: {}, // TODO: size-provider is off
  setPackages: (packages) => set((state) => ({ ...state, packages })),
  // setBundles: (bundles) => set((state) => ({ ...state, bundles })), // TODO: size-provider is off
}));

export default useStore;

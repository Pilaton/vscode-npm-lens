import { create } from "zustand";
import { type PackageDataAsync } from "../../providers/npm-provider";

type PackagesState = Record<string, PackageDataAsync>;

interface IStoreState {
  packages: PackagesState;
  setPackages: (packages: PackagesState) => void;
}
/* -------------------------------------------------------------------------- */

const useStore = create<IStoreState>()((set) => ({
  packages: {},
  setPackages: (packages) => {
    console.log("useStore · packages:", packages);
    set((state) => ({ ...state, packages }));
  },
}));

export default useStore;

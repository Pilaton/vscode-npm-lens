import { create } from 'zustand';
import type { PackageDataAsync } from '../../providers/npm-provider';

type PackagesState = Record<string, PackageDataAsync>;

interface StoreState {
  packages: PackagesState;
  setPackages: (packages: PackagesState) => void;
}
/* -------------------------------------------------------------------------- */

const useStore = create<StoreState>()((set) => ({
  packages: {},
  setPackages: (packages) => {
    set((state) => ({ ...state, packages }));
  },
}));

export default useStore;

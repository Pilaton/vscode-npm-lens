import { create } from 'zustand';
import type { PackageDataAsync } from '../services/npm-provider';

type PackagesState = Record<string, PackageDataAsync>;

interface StoreState {
  packages: PackagesState;
  setPackages: (packages: PackagesState) => void;
  // Set of packages currently in update queue
  updatingPackages: Set<string>;
  addUpdatingPackage: (packageName: string) => void;
  setUpdatingPackages: (packages: string[]) => void;
}

const useStore = create<StoreState>()((set) => ({
  packages: {},
  setPackages: (packages) => {
    set((state) => ({ ...state, packages }));
  },
  updatingPackages: new Set(),
  addUpdatingPackage: (packageName) => {
    set((state) => {
      const newSet = new Set(state.updatingPackages);
      newSet.add(packageName);
      return { ...state, updatingPackages: newSet };
    });
  },
  setUpdatingPackages: (packages) => {
    set((state) => ({ ...state, updatingPackages: new Set(packages) }));
  },
}));

export default useStore;

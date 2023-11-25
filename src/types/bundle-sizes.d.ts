export interface IBundleSizesData {
  gzip: number;
  size: number;
  dependencyCount?: number;
  url?: string;
}

export type BundleSizesDataAsync = Promise<IBundleSizesData | null>;

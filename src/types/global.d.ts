export type Dependencies = Record<string, string>;

export interface PackageJson {
  dependencies?: Dependencies;
  devDependencies?: Dependencies;
  peerDependencies?: Dependencies;
  bundleDependencies?: Dependencies;
  optionalDependencies?: Dependencies;
}
export type VsCodeApi = {
  postMessage: (msg: {
    type: "info" | "error" | "warning";
    text: string;
  }) => void;
};

declare global {
  interface Window {
    packageData: PackageJson;
    vscode: VsCodeApi;
  }
}

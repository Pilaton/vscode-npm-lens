import { type IPackageJson } from "src/utils/get-package-json";

export interface VsCodeApi {
  postMessage: (message: {
    type: "info" | "error" | "warning";
    text: string;
  }) => void;
}

declare global {
  interface Window {
    packageJson: IPackageJson;
    versionExtension: string;
    vscode: VsCodeApi;
  }
}

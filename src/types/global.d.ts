import { type PackageManager } from "pubun";
import { type IPackageJson } from "src/utils/get-package-json";
import type * as vscode from "vscode";

declare global {
  interface Window {
    packageJson: IPackageJson;
    versionExtension: string;
    packageManager: PackageManager;
    vscode: vscode.Webview;
  }
}

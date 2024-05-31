import type { PackageManager } from 'pubun';
import type { PackageJson } from 'src/utils/get-package-json';
import type * as vscode from 'vscode';

declare global {
  interface Window {
    packageJson: PackageJson;
    versionExtension: string;
    packageManager: PackageManager;
    vscode: vscode.Webview;
  }
}

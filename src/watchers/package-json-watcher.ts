import * as vscode from "vscode";

import getRootPath from "../utils/get-root-path";

import type WebViewPanelController from "../controllers/web-view-panel";

const packageJsonWatcher = (
  context: vscode.ExtensionContext,
  webView: WebViewPanelController,
) => {
  const rootPath = getRootPath();
  const watcher = vscode.workspace.createFileSystemWatcher(
    `${rootPath}/package.json`,
  );

  watcher.onDidCreate(async () => {
    try {
      await webView.updateContent();
    } catch (error) {
      console.error("Error updating the web view panel:", error);
    }
  });

  watcher.onDidChange(async () => {
    try {
      await webView.updateContent();
    } catch (error) {
      console.error("Error updating the web view panel:", error);
    }
  });

  context.subscriptions.push(watcher);
};

export default packageJsonWatcher;

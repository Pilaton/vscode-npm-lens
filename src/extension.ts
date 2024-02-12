import type * as vscode from "vscode";
import Context from "./controllers/context";
import TreeViewPanel from "./controllers/tree-view-panel";
import WebViewPanel from "./controllers/web-view-panel";
import packageJsonWatcher from "./watchers/package-json-watcher";

/* -------------------------------------------------------------------------- */

const handleWebViewVisible = (
  context: vscode.ExtensionContext,
  webView: WebViewPanel
) => {
  packageJsonWatcher(context, webView);

  return async (event: vscode.TreeViewVisibilityChangeEvent) => {
    event.visible ? await webView.open() : webView.close();
  };
};

export const activate = (context: vscode.ExtensionContext) => {
  Context.setContext(context);

  const webView = new WebViewPanel({
    extensionUri: context.extensionUri,
    viewType: "npmLens.webView",
    title: "npmLens",
    viewId: "panelIdA",
  });
  const treeView = new TreeViewPanel();

  const treeViewPanel = treeView.open();

  context.subscriptions.push(
    treeViewPanel.onDidChangeVisibility(handleWebViewVisible(context, webView))
  );
};

export const deactivate = (): void => {
  console.log("deactivate");
};

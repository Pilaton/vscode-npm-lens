import * as vscode from "vscode";

import Context from "./panels/context";
import TreeViewPanelController from "./panels/TreeViewPanel";
import WebViewPanelController from "./panels/WebViewPanel";
import getRootPath from "./utils/getRootPath";

/* -------------------------------------------------------------------------- */

/**
 * Handles the change in visibility of the tree view and manages the panel accordingly.
 * @param {object} e - The tree view visibility change event. This is of type vscode.TreeViewVisibilityChangeEvent.
 * @param {WebviewPanel} webViewPanel - The controller for the panel.
 */
const visibilityChangeHandler = (
  e: vscode.TreeViewVisibilityChangeEvent,
  webViewPanel: WebViewPanelController,
) => {
  if (e.visible) {
    webViewPanel.open();
  } else {
    webViewPanel.close();
  }
};

/**
 * Creates a file watcher for package.json and updates the panel when the file is changed.
 * @param {object} context - The extension context. This is of type vscode.ExtensionContext.
 * @param {WebViewPanelController} webViewPanel - The controller for the panel.
 */
const packageJsonChangeListener = (
  context: vscode.ExtensionContext,
  webViewPanel: WebViewPanelController,
) => {
  const rootPath = getRootPath();

  const watcher = vscode.workspace.createFileSystemWatcher(
    `${rootPath}/package.json`,
  );
  watcher.onDidChange(() => {
    webViewPanel.updateContent();
  });

  context.subscriptions.push(watcher);
};

/**
 * This method is called when the extension is activated.
 * @param {object} context - The context object provided by VS Code for the extension. This is of type vscode.ExtensionContext.
 */
export const activate = (context: vscode.ExtensionContext): void => {
  Context.setContext(context);
  console.log("======");

  const webViewPanel = new WebViewPanelController();

  const treeViewPanel = TreeViewPanelController.open();
  const visibilityChangeListener = treeViewPanel.onDidChangeVisibility((e) => {
    visibilityChangeHandler(e, webViewPanel);
  });

  context.subscriptions.push(visibilityChangeListener);

  packageJsonChangeListener(context, webViewPanel);
};

/**
 * This method is called when the extension is deactivated.
 */
export const deactivate = (): void => {
  console.log("deactivate");
};

import * as vscode from "vscode";

import getRootPath from "./utils/getRootPath";
import Context from "./webview/context";
import PanelController from "./webview/webview.controller";

/* -------------------------------------------------------------------------- */

/**
 * Initialize the tree view in the explorer of Visual Studio Code.
 * @returns {object} The tree view object for npm-lens, this is of type vscode.TreeView<vscode.TreeItem>.
 */
const initializeTreeView = (): vscode.TreeView<vscode.TreeItem> => {
  const getTreeItem = (el: vscode.TreeItem): vscode.TreeItem => el;
  const getChildren = (): never[] => [];
  return vscode.window.createTreeView("npm-lens.treeView", {
    treeDataProvider: { getTreeItem, getChildren },
  });
};

/**
 * Handles the change in visibility of the tree view and manages the panel accordingly.
 * @param {object} e - The tree view visibility change event. This is of type vscode.TreeViewVisibilityChangeEvent.
 * @param {PanelController} panelController - The controller for the panel.
 */
const visibilityChangeHandler = (
  e: vscode.TreeViewVisibilityChangeEvent,
  panelController: PanelController,
) => {
  if (e.visible) {
    panelController.openPanel();
  } else {
    panelController.closePanel();
  }
};

/**
 * Creates a file watcher for package.json and updates the panel when the file is changed.
 * @param {object} context - The extension context. This is of type vscode.ExtensionContext.
 * @param {PanelController} panelController - The controller for the panel.
 */
const packageJsonChangeListener = (
  context: vscode.ExtensionContext,
  panelController: PanelController,
) => {
  const rootPath = getRootPath();

  const watcher = vscode.workspace.createFileSystemWatcher(
    `${rootPath}/package.json`,
  );
  watcher.onDidChange(() => panelController.updatePanelContent());

  context.subscriptions.push(watcher);
};

/**
 * This method is called when the extension is activated.
 * @param {object} context - The context object provided by VS Code for the extension. This is of type vscode.ExtensionContext.
 */
export const activate = (context: vscode.ExtensionContext): void => {
  Context.setContext(context);
  console.log("======");

  const panelController = new PanelController();

  const treeView = initializeTreeView();
  const visibilityChangeListener = treeView.onDidChangeVisibility((e) =>
    visibilityChangeHandler(e, panelController),
  );

  context.subscriptions.push(visibilityChangeListener);

  packageJsonChangeListener(context, panelController);
};

/**
 * This method is called when the extension is deactivated.
 */
export const deactivate = (): void => {
  console.log("deactivate");
};

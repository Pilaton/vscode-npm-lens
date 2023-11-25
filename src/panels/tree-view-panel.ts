import * as vscode from "vscode";

const TreeViewPanelController = {
  /**
   * Initialize the tree view in the explorer of Visual Studio Code.
   * @returns {object} The tree view object for npm-lens, this is of type vscode.TreeView<vscode.TreeItem>.
   */
  open(): vscode.TreeView<vscode.TreeItem> {
    const getTreeItem = (element: vscode.TreeItem): vscode.TreeItem => element;
    const getChildren = (): never[] => [];

    const panel = vscode.window.createTreeView("npm-lens.treeView", {
      treeDataProvider: { getTreeItem, getChildren },
    });

    return panel;
  },
};

export default TreeViewPanelController;

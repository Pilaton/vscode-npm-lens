import * as vscode from "vscode";

class TreeViewPanelController {
  panel?: vscode.TreeView<vscode.TreeItem>;

  static open() {
    const panel = vscode.window.createTreeView("npm-lens.treeView", {
      treeDataProvider: {
        getTreeItem: (element: vscode.TreeItem) => element,
        getChildren: () => null,
      },
    });
    return panel;
  }
}

export default TreeViewPanelController;

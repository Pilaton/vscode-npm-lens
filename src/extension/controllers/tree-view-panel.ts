import * as vscode from 'vscode';

class TreeViewPanelController {
  #panel?: vscode.TreeView<vscode.TreeItem>;

  open() {
    if (this.#panel) {
      return this.#panel;
    }

    this.#createTreeViewPanel();
    return this.#panel!;
  }

  #createTreeViewPanel() {
    this.#panel = vscode.window.createTreeView('npm-lens.treeView', {
      treeDataProvider: {
        getTreeItem: (element: vscode.TreeItem) => element,
        getChildren: () => [],
      },
    });
  }
}

export default TreeViewPanelController;

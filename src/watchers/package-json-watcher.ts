import vscode from 'vscode';
import type WebViewPanelController from '../controllers/web-view-panel';
import getRootPath from '../utils/get-root-path';

const packageJsonWatcher = (context: vscode.ExtensionContext, webView: WebViewPanelController) => {
  const rootPath = getRootPath();
  const watcher = vscode.workspace.createFileSystemWatcher(`${rootPath}/package.json`);

  watcher.onDidCreate(async () => {
    try {
      await webView.update();
    } catch (error) {
      console.error('Error updating the web view panel:', error);
    }
  });

  watcher.onDidChange(async () => {
    try {
      await webView.update();
    } catch (error) {
      console.error('Error updating the web view panel:', error);
    }
  });

  context.subscriptions.push(watcher);
};

export default packageJsonWatcher;

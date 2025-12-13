import * as vscode from 'vscode';
import type WebViewPanelController from '../controllers/web-view';
import getRootPath from '../utils/get-root-path';

const packageJsonWatcher = (context: vscode.ExtensionContext, webView: WebViewPanelController) => {
  const rootUri = getRootPath();
  if (!rootUri) {
    return;
  }

  const pattern = new vscode.RelativePattern(rootUri, 'package.json');
  const watcher = vscode.workspace.createFileSystemWatcher(pattern);

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

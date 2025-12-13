import * as vscode from 'vscode';

const getRootPath = (): vscode.Uri | undefined => {
  const { workspaceFolders } = vscode.workspace;

  if (!workspaceFolders || workspaceFolders.length === 0) {
    return undefined;
  }

  return workspaceFolders[0].uri;
};

export default getRootPath;

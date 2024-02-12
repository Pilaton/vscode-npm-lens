import { workspace } from "vscode";

const getRootPath = () => {
  const { workspaceFolders } = workspace;

  if (!workspaceFolders || workspaceFolders.length === 0) {
    throw new Error("No workspace folders found.");
  }

  return workspaceFolders[0].uri.fsPath;
};

export default getRootPath;

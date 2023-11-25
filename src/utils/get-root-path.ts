import { workspace } from "vscode";

const getRootPath = (): string => {
  try {
    const { workspaceFolders } = workspace;
    const rootPath =
      workspaceFolders && workspaceFolders.length > 0
        ? workspaceFolders[0].uri.fsPath
        : undefined;

    if (!rootPath) throw new Error();

    return rootPath;
  } catch {
    throw new Error("Workspace is empty...");
  }
};
export default getRootPath;

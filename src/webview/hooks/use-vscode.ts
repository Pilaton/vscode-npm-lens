import type { AlertMessage } from 'src/shared/types/messages';

/**
 * Hook providing type-safe actions for communicating with the VS Code extension.
 * Note: useCallback is not needed - React Compiler handles memoization automatically.
 */
export function useVscode() {
  const postMessage = (message: Parameters<typeof window.vscode.postMessage>[0]) => {
    window.vscode.postMessage(message);
  };

  const updatePackageToVersion = (packageName: string, targetVersion: string) => {
    postMessage({ command: 'updatePackage', packageName, targetVersion });
  };

  const removePackage = (packageName: string) => {
    postMessage({ command: 'removePackage', packageName });
  };

  const showAlert = (type: AlertMessage['type'], text: string) => {
    postMessage({ command: 'alert', type, text });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showAlert('info', `Copied "${text}" to clipboard`);
  };

  return {
    postMessage,
    updatePackageToVersion,
    removePackage,
    showAlert,
    copyToClipboard,
  };
}

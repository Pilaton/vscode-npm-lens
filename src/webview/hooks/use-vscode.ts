import { useCallback } from 'react';
import type { AlertMessage } from 'src/shared/types/messages';

/**
 * Hook providing type-safe actions for communicating with the VS Code extension.
 */
export function useVscode() {
  const postMessage = useCallback((message: Parameters<typeof window.vscode.postMessage>[0]) => {
    window.vscode.postMessage(message);
  }, []);

  const updatePackageToVersion = useCallback(
    (packageName: string, targetVersion: string) => {
      postMessage({ command: 'updatePackage', packageName, targetVersion });
    },
    [postMessage]
  );

  const removePackage = useCallback(
    (packageName: string) => {
      postMessage({ command: 'removePackage', packageName });
    },
    [postMessage]
  );

  const showAlert = useCallback(
    (type: AlertMessage['type'], text: string) => {
      postMessage({ command: 'alert', type, text });
    },
    [postMessage]
  );

  const copyToClipboard = useCallback(
    (text: string) => {
      navigator.clipboard.writeText(text);
      showAlert('info', `Copied "${text}" to clipboard`);
    },
    [showAlert]
  );

  return {
    postMessage,
    updatePackageToVersion,
    removePackage,
    showAlert,
    copyToClipboard,
  };
}

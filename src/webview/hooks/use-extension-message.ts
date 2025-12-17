import { useEffect, useState } from 'react';
import type { ExtensionToWebviewMessage, InitMessage } from '../../shared/types/messages';
import useStore from '../store/store';

interface ExtensionData {
  packageJson: InitMessage['data']['packageJson'] | null;
  extensionVersion: string;
  packageManager: InitMessage['data']['packageManager'];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook for receiving messages from the VS Code extension.
 * Sends a 'ready' signal on mount, then listens for messages.
 */
export function useExtensionMessage(): ExtensionData {
  const setUpdatingPackages = useStore((state) => state.setUpdatingPackages);
  const [data, setData] = useState<ExtensionData>({
    packageJson: null,
    extensionVersion: '',
    packageManager: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const handleMessage = (event: MessageEvent<ExtensionToWebviewMessage>) => {
      const message = event.data;

      if (message.type === 'init') {
        // Sync updating packages to global store
        setUpdatingPackages(message.data.updatingPackages);
        setData({
          packageJson: message.data.packageJson,
          extensionVersion: message.data.extensionVersion,
          packageManager: message.data.packageManager,
          isLoading: false,
          error: null,
        });
      } else if (message.type === 'syncUpdating') {
        // Update loader state when packages finish updating
        setUpdatingPackages(message.updatingPackages);
      } else if (message.type === 'error') {
        setData((prev) => ({
          ...prev,
          isLoading: false,
          error: message.message,
        }));
      }
    };

    window.addEventListener('message', handleMessage);

    // Signal to extension that webview is ready
    window.vscode.postMessage({ command: 'ready' });

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [setUpdatingPackages]);

  return data;
}

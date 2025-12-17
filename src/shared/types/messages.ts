/**
 * Message types for communication between webview and extension.
 */

import type { PackageManager } from 'pubun';
import type { PackageJson } from '../../extension/utils/get-package-json';

/* -------------------------------------------------------------------------- */
/*                        Webview → Extension Messages                        */
/* -------------------------------------------------------------------------- */

interface UpdatePackageMessage {
  command: 'updatePackage';
  packageName: string;
  targetVersion?: string;
}

interface RemovePackageMessage {
  command: 'removePackage';
  packageName: string;
}

export interface AlertMessage {
  command: 'alert';
  type: 'info' | 'warning' | 'error';
  text: string;
}

interface ReadyMessage {
  command: 'ready';
}

export type WebviewMessage =
  | UpdatePackageMessage
  | RemovePackageMessage
  | AlertMessage
  | ReadyMessage;

/* -------------------------------------------------------------------------- */
/*                        Extension → Webview Messages                        */
/* -------------------------------------------------------------------------- */

export interface InitMessage {
  type: 'init';
  data: {
    packageJson: PackageJson;
    extensionVersion: string;
    packageManager: PackageManager | null;
    updatingPackages: string[];
  };
}

interface SyncUpdatingMessage {
  type: 'syncUpdating';
  updatingPackages: string[];
}

interface ErrorMessage {
  type: 'error';
  message: string;
}

export type ExtensionToWebviewMessage = InitMessage | SyncUpdatingMessage | ErrorMessage;

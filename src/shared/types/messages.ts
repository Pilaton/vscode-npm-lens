/**
 * Message types for communication between webview and extension.
 */

import type { PackageManager } from 'pubun';
import type { PackageJson } from '../../extension/utils/get-package-json';

/* -------------------------------------------------------------------------- */
/*                        Webview → Extension Messages                        */
/* -------------------------------------------------------------------------- */

export interface UpdatePackageMessage {
  command: 'updatePackage';
  packageName: string;
  targetVersion?: string; // Optional: specific version to install (e.g., "4.0.9")
}

export interface RemovePackageMessage {
  command: 'removePackage';
  packageName: string;
}

export interface AlertMessage {
  command: 'alert';
  type: 'info' | 'warning' | 'error';
  text: string;
}

export interface ReadyMessage {
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
    updatingPackages: string[]; // Package names currently in update queue
  };
}

export interface ErrorMessage {
  type: 'error';
  message: string;
}

export type ExtensionToWebviewMessage = InitMessage | ErrorMessage;

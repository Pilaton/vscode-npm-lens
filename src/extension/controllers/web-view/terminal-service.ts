import { exec } from 'node:child_process';
import { defineManager, type PackageManager } from 'pubun';
import * as vscode from 'vscode';
import getRootPath from '../../utils/get-root-path';
import { getTerminalCommand, type TerminalCommandOptions } from '../../utils/get-terminal-command';

const TERMINAL_NAME = 'npmLens Terminal';

// Command queue for sequential execution
interface QueuedCommand {
  commandType: TerminalCommandOptions['commandType'];
  packageName?: string;
  targetVersion?: string;
  resolve: () => void;
  reject: (error: Error) => void;
}

const commandQueue: QueuedCommand[] = [];
let isProcessing = false;
const updatingPackagesQueue: Set<string> = new Set();

/**
 * Get the list of packages currently in the update queue.
 */
export function getUpdatingPackages(): string[] {
  return Array.from(updatingPackagesQueue);
}

/**
 * Get or create the npmLens terminal.
 */
function getTerminal(): vscode.Terminal {
  let terminal = vscode.window.terminals.find((t) => t.name === TERMINAL_NAME);

  if (!terminal) {
    terminal = vscode.window.createTerminal(TERMINAL_NAME);
  }

  return terminal;
}

/**
 * Get the package manager used in the current project.
 * Falls back to 'npm' if no lock file is detected.
 */
export async function getPackageManager(): Promise<PackageManager> {
  const rootUri = getRootPath();
  if (!rootUri) {
    return 'npm';
  }

  const detected = await defineManager(rootUri.fsPath);
  return detected ?? 'npm';
}

/**
 * Execute a command silently in the background.
 */
async function executeSilentCommand(
  command: string,
  cwd: string
): Promise<{ success: boolean; output: string }> {
  return new Promise((resolve) => {
    exec(command, { cwd, timeout: 30000 }, (error, stdout, stderr) => {
      if (error) {
        resolve({ success: false, output: stderr || error.message });
      } else {
        resolve({ success: true, output: stdout });
      }
    });
  });
}

/**
 * Process the next command in the queue.
 */
async function processQueue(): Promise<void> {
  if (isProcessing || commandQueue.length === 0) {
    return;
  }

  isProcessing = true;
  const { commandType, packageName, targetVersion, resolve, reject } = commandQueue.shift()!;

  try {
    const rootUri = getRootPath();
    if (!rootUri) {
      throw new Error('Workspace path not found.');
    }

    const packageManager = await getPackageManager();

    const command = getTerminalCommand({
      commandType,
      packageManager,
      packageName,
      targetVersion,
    });

    const versionText = targetVersion ? `@${targetVersion}` : '';
    const actionText = commandType === 'update' ? 'Updating' : 'Removing';
    const successText = commandType === 'update' ? 'updated' : 'removed';

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: `${actionText} ${packageName}${versionText}...`,
        cancellable: false,
      },
      async () => {
        const result = await executeSilentCommand(command, rootUri.fsPath);

        if (result.success) {
          vscode.window.showInformationMessage(`✓ ${packageName} ${successText} successfully`);
        } else {
          const action = await vscode.window.showErrorMessage(
            `Failed to ${commandType} ${packageName}`,
            'Show Details'
          );

          if (action === 'Show Details') {
            const terminal = getTerminal();
            terminal.show();
            // Just show the failed command - user can see the error in the notification
            terminal.sendText(`echo "Failed command: ${command}"`);
            terminal.sendText(`echo "You can re-run it manually below:"`);
            terminal.sendText(command);
          }
        }
      }
    );

    resolve();
  } catch (error) {
    reject(error instanceof Error ? error : new Error(String(error)));
  } finally {
    isProcessing = false;
    if (packageName) {
      updatingPackagesQueue.delete(packageName);
    }
    // Process next command in queue
    processQueue();
  }
}

export async function executePackageCommand(
  commandType: TerminalCommandOptions['commandType'],
  packageName?: string,
  targetVersion?: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (packageName) {
      updatingPackagesQueue.add(packageName);
    }
    commandQueue.push({ commandType, packageName, targetVersion, resolve, reject });
    processQueue();
  });
}

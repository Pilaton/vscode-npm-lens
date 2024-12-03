/* eslint-disable max-classes-per-file */
import { type PackageManager, defineManager } from 'pubun';
import vscode from 'vscode';
import getPackageJson, { type PackageJson } from '../utils/get-package-json';
import getRootPath from '../utils/get-root-path';
import { type TerminalCommandOptions, getTerminalCommand } from '../utils/get-terminal-command';
import { getContext } from './context';

interface UpdateAllPackageMessage {
  command: 'updateAllPackages';
}
interface UpdatePackageMessage {
  command: 'updatePackage';
  packageName: string;
}
interface RemovePackageMessage {
  command: 'removePackage';
  packageName: string;
}
interface AlertMessage {
  command: 'alert';
  type: 'info' | 'warning' | 'error';
  text: string;
}

export type MessageListener =
  | UpdatePackageMessage
  | UpdateAllPackageMessage
  | RemovePackageMessage
  | AlertMessage;

const errorStyle =
  'height: 100svh;font-size: 1.25rem;display: flex;justify-content: center;align-items: center;';

/* ========================================================================== */
interface WebViewStartOptions {
  extensionUri: vscode.Uri;
  viewType: string;
  title: string;
  viewId: string;
  scriptUri?: vscode.Uri;
  styleUri?: vscode.Uri;
}

interface ContentWindowData {
  packageJson?: PackageJson;
  versionExtension?: string;
  packageManager?: PackageManager | null;
}
interface ContentErrorMessage {
  errorMessage?: string;
}
type CuContentType = ContentWindowData & ContentErrorMessage;

/**
 * WebViewStart
 */
abstract class WebViewStart {
  protected readonly options: WebViewStartOptions;

  constructor(options: WebViewStartOptions) {
    this.options = {
      scriptUri: vscode.Uri.joinPath(options.extensionUri, 'dist/webview.js'),
      styleUri: vscode.Uri.joinPath(options.extensionUri, 'dist/style.css'),

      ...options,
    };
  }

  protected getContent(webview: vscode.Webview, opt: CuContentType) {
    const scriptUri = webview.asWebviewUri(this.options.scriptUri!).toString();
    // const styleUri = webview.asWebviewUri(this.options.styleUri!).toString();
    // <link href="${styleUri}" rel="stylesheet" />

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1. d0">
        <title>${this.options.title}</title>
      </head>
      <body style="margin:0;padding:0;">
        ${opt?.errorMessage ?? ''}
        <div id="root"></div>
        <script>
          window.packageJson = ${JSON.stringify(opt?.packageJson ?? '')};
          window.versionExtension = ${JSON.stringify(opt?.versionExtension ?? '')};
          window.packageManager = ${JSON.stringify(opt?.packageManager ?? '')};
          window.vscode = acquireVsCodeApi();
        </script>
        <script src="${scriptUri}"></script>
      </body>
      </html>`;
  }
}

/**
 * WebViewPanelController
 */
export default class WebViewPanelController extends WebViewStart {
  #panel?: vscode.WebviewPanel;

  readonly #context = getContext();

  async open(): Promise<void> {
    if (this.#panel) {
      this.#panel.reveal(vscode.ViewColumn.One);
    } else {
      this.#createWebviewPanel();
    }

    await this.update();
  }

  async update(): Promise<void> {
    if (!this.#panel) {
      return;
    }

    try {
      const packageJson = await getPackageJson();
      const packageManager = await this.#getPackageManager();
      const versionExtension = this.#getVersionExtension();

      const options: CuContentType = packageJson
        ? {
            packageJson,
            packageManager,
            versionExtension,
          }
        : {
            errorMessage: this.#getErrorHtml('Workspace has no package.json'),
          };

      this.#panel.webview.html = this.getContent(this.#panel.webview, options);
    } catch (error) {
      console.error('Error updating content:', error);
      this.#panel.webview.html = this.#getErrorHtml('Error loading package.json');
    }
  }

  isOpen(): boolean {
    return Boolean(this.#panel);
  }

  close(): void {
    this.#panel?.dispose();
  }

  /* ========================================================================== */
  /*                               PRIVATE METHODS                              */
  /* ========================================================================== */
  #createWebviewPanel() {
    this.#panel = vscode.window.createWebviewPanel(
      this.options.viewType,
      this.options.title,
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(this.#context.extensionUri, 'dist')],
      }
    );

    this.#enablePanelWatcher();
    this.#enablePanelMessageWatcher();
  }

  /**
   * Activate a terminal
   */
  #activateTerminal() {
    const terminalName = 'npmLens Terminal';
    let terminal = vscode.window.terminals.find((t) => t.name === terminalName);

    if (!terminal) {
      terminal = vscode.window.createTerminal(terminalName);
    }

    return terminal;
  }

  /**
   * Sets up an event listener for the disposal of the webview panel.
   */
  #enablePanelWatcher() {
    this.#panel?.onDidDispose(() => {
      this.#panel = undefined;
    });
  }

  /**
   * Sets up a message listener for the webview panel to handle various commands.
   *
   * This method listens for messages sent from the webview and executes different actions
   * based on the command specified in the message. Supported commands include:
   * - "updateAllPackages": Creates a terminal (if not already created) and sends a command to update all packages.
   * - "updatePackage": Similar to "updateAllPackages", but for a specific package.
   * - "removePackage": Remove a package with a specific name.
   * - "alert": Displays a VS Code informational, warning, or error message based on the alert type.
   *
   */
  #enablePanelMessageWatcher() {
    const messageHandlers = {
      info: vscode.window.showInformationMessage,
      warning: vscode.window.showWarningMessage,
      error: vscode.window.showErrorMessage,
    };

    const executeTerminalCommand = async (
      commandType: TerminalCommandOptions['commandType'],
      packageName?: string
    ) => {
      const terminal = this.#activateTerminal();
      terminal.show();

      const packageManager = await this.#getPackageManager();
      if (!packageManager) {
        throw new Error('Package manager could not be determined.');
      }

      const command = getTerminalCommand({
        commandType,
        packageManager,
        packageName,
      });

      setTimeout(() => {
        terminal.sendText(command);
      }, 500);
    };

    const handleMessage = async (message: MessageListener) => {
      switch (message?.command) {
        case 'updateAllPackages': {
          await executeTerminalCommand('updateAll');
          break;
        }

        case 'updatePackage': {
          await executeTerminalCommand('update', message?.packageName);
          break;
        }

        case 'removePackage': {
          await executeTerminalCommand('remove', message?.packageName);
          break;
        }

        case 'alert': {
          const { type, text } = message;
          await messageHandlers[type](text);
          break;
        }
        default: {
          break;
        }
      }
    };

    this.#panel?.webview.onDidReceiveMessage(handleMessage, undefined, this.#context.subscriptions);
  }

  /**
   * Generates an HTML string representing an error message, styled with predefined CSS.
   * @param {string} message The error message to be displayed.
   */
  #getErrorHtml(message: string): string {
    return `<div style="${errorStyle}">${message}</div>`;
  }

  /**
   * Get version npmLens
   * @returns {string}
   */
  #getVersionExtension(): string {
    const packageJsonExtension = this.#context.extension.packageJSON as {
      version: string;
    };
    return packageJsonExtension.version;
  }

  /**
   * Identifies the package manager used in the current project.
   * @returns {Promise<PackageManager | null>}
   */
  async #getPackageManager(): Promise<PackageManager | null> {
    const rootPath = getRootPath();

    const packageManager = await defineManager(rootPath);
    // console.log(
    //   "WebViewPanelController · #getPackageManager · packageManager:",
    //   packageManager
    // );
    return packageManager;
  }
}

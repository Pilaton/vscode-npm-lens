import * as vscode from 'vscode';
import type { ExtensionToWebviewMessage, WebviewMessage } from '../../../shared/types/messages';
import getPackageJson from '../../utils/get-package-json';
import { getContext } from '../context';
import { generateHtml, getErrorHtml, type WebViewOptions } from './html-template';
import { executePackageCommand, getPackageManager, getUpdatingPackages } from './terminal-service';

/**
 * Controller for the npmLens WebView panel.
 */
export default class WebViewPanelController {
  #panel?: vscode.WebviewPanel;
  #isReady = false;

  readonly #context = getContext();
  readonly #options: WebViewOptions;
  readonly #scriptUri: vscode.Uri;

  constructor(options: WebViewOptions) {
    this.#options = options;
    this.#scriptUri = vscode.Uri.joinPath(options.extensionUri, 'dist/webview.js');
  }

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

      if (!packageJson) {
        this.#panel.webview.html = getErrorHtml('Workspace has no package.json');
        return;
      }

      // If webview not ready yet, set HTML first
      if (!this.#isReady) {
        this.#panel.webview.html = generateHtml(
          this.#panel.webview,
          this.#scriptUri,
          this.#options.title
        );
      }

      // Send data via message
      const packageManager = await getPackageManager();
      const extensionVersion = this.#getVersionExtension();

      this.#sendMessage({
        type: 'init',
        data: {
          packageJson,
          extensionVersion,
          packageManager,
          updatingPackages: getUpdatingPackages(),
        },
      });
    } catch (error) {
      console.error('Error updating content:', error);
      this.#sendMessage({
        type: 'error',
        message: 'Error loading package.json',
      });
    }
  }

  isOpen(): boolean {
    return Boolean(this.#panel);
  }

  close(): void {
    this.#panel?.dispose();
  }

  #sendMessage(message: ExtensionToWebviewMessage): void {
    this.#panel?.webview.postMessage(message);
  }

  #createWebviewPanel() {
    this.#panel = vscode.window.createWebviewPanel(
      this.#options.viewType,
      this.#options.title,
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(this.#context.extensionUri, 'dist')],
      }
    );

    this.#panel.iconPath = vscode.Uri.joinPath(this.#options.extensionUri, 'public/icon-panel.svg');

    this.#enablePanelWatcher();
    this.#enableMessageHandler();
  }

  #enablePanelWatcher() {
    const disposable = this.#panel?.onDidDispose(() => {
      this.#panel = undefined;
      this.#isReady = false;
    });

    if (disposable) {
      this.#context.subscriptions.push(disposable);
    }
  }

  #enableMessageHandler() {
    const messageHandlers = {
      info: vscode.window.showInformationMessage,
      warning: vscode.window.showWarningMessage,
      error: vscode.window.showErrorMessage,
    };

    const handleMessage = async (message: WebviewMessage) => {
      // Handle 'ready' signal from webview
      if (message?.command === 'ready') {
        this.#isReady = true;
        await this.update();
        return;
      }

      switch (message?.command) {
        case 'updatePackage': {
          await executePackageCommand('update', message?.packageName, message?.targetVersion);
          // Sync updating state to webview after command completes
          this.#sendMessage({
            type: 'syncUpdating',
            updatingPackages: getUpdatingPackages(),
          });
          break;
        }

        case 'removePackage': {
          await executePackageCommand('remove', message?.packageName);
          // Sync updating state to webview after command completes
          this.#sendMessage({
            type: 'syncUpdating',
            updatingPackages: getUpdatingPackages(),
          });
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

  #getVersionExtension(): string {
    const packageJsonExtension = this.#context.extension.packageJSON as {
      version: string;
    };
    return packageJsonExtension.version;
  }
}

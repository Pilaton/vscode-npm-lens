import { type PackageManager } from "pubun";
import * as vscode from "vscode";

import getPackageJson, { type IPackageJson } from "../utils/get-package-json";
import getRootPath from "../utils/get-root-path";
import getTerminalUpdateCommand from "../utils/get-terminal-update-command";

import Context from "./context";

interface IUpdateAllPackageMessage {
  command: "updateAllPackages";
}
interface IUpdatePackageMessage {
  command: "updatePackage";
  packageName: string;
}
interface IAlertMessage {
  command: "alert";
  type: "info" | "warning" | "error";
  text: string;
}

export type MessageListener =
  | IUpdatePackageMessage
  | IUpdateAllPackageMessage
  | IAlertMessage;

const errorStyle =
  "height: 100svh;font-size: 1.25rem;display: flex;justify-content: center;align-items: center;";

export default class WebViewPanelController {
  #panel?: vscode.WebviewPanel;

  readonly #context = Context.getContext();

  readonly #webViewType = "npmLens.webView";

  readonly #webViewTitle = "npmLens";

  readonly #webViewHtmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1. d0">
        <title>${this.#webViewTitle}</title>
      </head>
      <body style="margin:0;padding:0;">
        %%CONTENT%%
      </body>
      </html>`;

  async open(): Promise<void> {
    if (this.#panel) {
      this.#panel.reveal(vscode.ViewColumn.One);
    } else {
      this.#createWebviewPanel();
    }

    await this.updateContent();
  }

  async updateContent(): Promise<void> {
    if (!this.#panel) return;

    try {
      const packageJson = await getPackageJson();
      const content = packageJson
        ? await this.#getContentWithPackageJson(packageJson)
        : this.#getErrorHtml("Workspace has no package.json");

      this.#panel.webview.html = this.#buildHtml(content);
    } catch (error) {
      console.error("Error updating content:", error);
      this.#panel.webview.html = this.#getErrorHtml(
        "Error loading package.json",
      );
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
      this.#webViewType,
      this.#webViewTitle,
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.joinPath(this.#context.extensionUri, "dist"),
        ],
      },
    );

    this.#enablePanelWatcher();
    this.#enablePanelMessageWatcher();
  }

  /**
   * Create a terminal
   */
  #createTerminal(terminalName: string) {
    return vscode.window.createTerminal(terminalName);
  }

  /**
   * Asynchronously generates HTML content for a webview panel, incorporating dynamic data.
   *
   * @param {IPackageJson} packageJson - The parsed `package.json` file of the current project,
   * providing context and data to the React application.
   * @returns {Promise<string>} A promise that resolves to the full HTML content string, ready to be
   * loaded into the webview. This includes script tags for setting up initial state and integrating
   * the React application.
   */
  async #getContentWithPackageJson(packageJson: IPackageJson): Promise<string> {
    const reactAppUri = this.#getReactAppUri();

    const versionExtension = this.#getVersionExtension();

    const packageManager = await this.#getPackageManager();

    return `
      <script>
        window.packageJson = ${JSON.stringify(packageJson)};
        window.versionExtension = ${versionExtension};
        window.packageManager = ${JSON.stringify(packageManager)};
        window.vscode = acquireVsCodeApi();
      </script>
      <div id="root"></div>
      <script src="${String(reactAppUri)}"></script>
    `;
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
   * - "alert": Displays a VS Code informational, warning, or error message based on the alert type.
   *
   */
  #enablePanelMessageWatcher() {
    const messageHandlers = {
      info: vscode.window.showInformationMessage,
      warning: vscode.window.showWarningMessage,
      error: vscode.window.showErrorMessage,
    };

    this.#panel?.webview.onDidReceiveMessage(
      async (message: MessageListener) => {
        switch (message?.command) {
          case "updateAllPackages":
          case "updatePackage": {
            const terminal = this.#createTerminal("npmLens Terminal");
            terminal.show();

            const packageManager = await this.#getPackageManager();
            if (!packageManager) {
              throw new Error("Package manager could not be determined.");
            }

            const command = getTerminalUpdateCommand({
              packageManager,
              packageName:
                "packageName" in message ? message.packageName : undefined,
            });

            setTimeout(() => terminal.sendText(command), 500);
            break;
          }

          case "alert": {
            const { type, text } = message;
            messageHandlers[type](text);
            break;
          }
          default: {
            break;
          }
        }
      },
      undefined,
      this.#context.subscriptions,
    );
  }

  /**
   * Generates an HTML string representing an error message, styled with predefined CSS.
   * @param {string} message The error message to be displayed.
   */
  #getErrorHtml(message: string): string {
    return `<div style="${errorStyle}">${message}</div>`;
  }

  /**
   * Constructs the full HTML content for a webview by inserting provided content into a template.
   * @param {string} content The dynamic content to be inserted into the HTML template.
   */
  #buildHtml(content: string): string {
    return this.#webViewHtmlTemplate.replace("%%CONTENT%%", content);
  }

  /**
   * Constructs and retrieves the URI for a React application script to be used within a Visual Studio Code webview.
   * @returns {vscode.Uri}
   */
  #getReactAppUri(): vscode.Uri {
    const reactAppScript = vscode.Uri.joinPath(
      this.#context.extensionUri,
      "dist",
      "webview.js",
    );
    const reactAppUri = this.#panel?.webview.asWebviewUri(reactAppScript);
    if (!reactAppUri) {
      throw new Error("Failed to get react app uri");
    }
    return reactAppUri;
  }

  /**
   * Get version npmLens
   * @returns {string}
   */
  #getVersionExtension(): string {
    const packageJSONExtension = this.#context.extension.packageJSON as {
      version: string;
    };
    return JSON.stringify(packageJSONExtension.version);
  }

  /**
   * Identifies the package manager used in the current project.
   * @returns {Promise<PackageManager | null>}
   */
  async #getPackageManager(): Promise<PackageManager | null> {
    const rootPath = getRootPath();
    const { defineManager } = await import("pubun");
    const packageManager = await defineManager(rootPath);
    return packageManager;
  }
}

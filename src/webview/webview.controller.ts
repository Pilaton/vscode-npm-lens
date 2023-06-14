import path from "path";

import * as vscode from "vscode";

import { PackageJson } from "../types/global";
import getPackageJson from "../utils/getPackageJson";

import Context from "./context";

const errorStyle =
  "height: 100svh;font-size: 1.25rem;display: flex;justify-content: center;align-items: center;";

class PanelController {
  /* eslint-disable @typescript-eslint/lines-between-class-members */
  private panel?: vscode.WebviewPanel;
  private readonly context = Context.getContext();
  private readonly webViewType = "npmLens.webView";
  private readonly webViewTitle = "npmLens";

  private get webviewHtmlTemplate() {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${this.webViewTitle}</title>
      </head>
      <body style="margin:0;padding:0;">
        %%CONTENT%%
      </body>
      </html>`;
  }
  /* eslint-enable @typescript-eslint/lines-between-class-members */

  /**
   * Opens a new webview panel in Visual Studio Code or reveals the existing one.
   * @returns {void}
   */
  openPanel(): void {
    if (this.panel) {
      this.panel.reveal(vscode.ViewColumn.One);
      return;
    }

    this.panel = vscode.window.createWebviewPanel(
      this.webViewType,
      this.webViewTitle,
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(this.context.extensionPath, "dist")),
        ],
      }
    );

    this.panel.onDidDispose(() => {
      this.panel = undefined;
    });

    this.updatePanelContent();
    this.enableMessageHandler();
  }

  /**
   * Updates the content of the webview panel with the package.json file or an error message.
   * @returns {void}
   */
  updatePanelContent(): void {
    if (!this.panel) return;

    let content: string;
    try {
      const packageJson = getPackageJson();
      content = packageJson
        ? this.getContentWithPackageJson(packageJson)
        : `<div style="${errorStyle}">Workspace has no package.json</div>`;
    } catch {
      content = `<div style="${errorStyle}">Error occurred when loading package.json</div>`;
    }

    this.panel.webview.html = this.webviewHtmlTemplate.replace(
      "%%CONTENT%%",
      content
    );
  }

  /**
   * Retrieves the package.json content and embeds it in the HTML content for the panel.
   * @param {PackageJson} packageJson - The parsed package.json file.
   * @returns {string} The HTML content with the package.json data embedded.
   */
  private getContentWithPackageJson(packageJson: PackageJson): string {
    const reactAppPath = vscode.Uri.file(
      path.join(this.context.extensionPath, "dist", "webview.js")
    );
    const reactAppUri = this.panel?.webview.asWebviewUri(reactAppPath);
    if (!reactAppUri) throw new Error("Failed to get react app uri");

    const pkgJSONExt = this.context.extension.packageJSON as {
      version: string;
    };
    return `
      <script>
        window.packageData = ${JSON.stringify(packageJson)};
        window.versionExtension = ${JSON.stringify(pkgJSONExt.version)};
        window.vscode = acquireVsCodeApi();
      </script>
      <div id="root"></div>
      <script src="${String(reactAppUri)}"></script>
    `;
  }

  /**
   * Enables a message handler that listens for specific message types and displays corresponding messages.
   * @returns {void}
   */
  private enableMessageHandler(): void {
    const messageTypes: {
      [key: string]: (msg: string) => Thenable<string | undefined>;
    } = {
      info: vscode.window.showInformationMessage,
      warning: vscode.window.showWarningMessage,
      error: vscode.window.showErrorMessage,
    };

    this.panel?.webview.onDidReceiveMessage(
      ({ type, text }: { type: string; text: string }) => {
        const handler = messageTypes[type];
        handler(text);
      },
      undefined,
      this.context.subscriptions
    );
  }

  /**
   * Checks if the panel is currently open.
   * @returns {boolean} Returns true if the panel is open, false otherwise.
   */
  isOpen(): boolean {
    return Boolean(this.panel);
  }

  /**
   * Closes the webview panel if it's currently open.
   * @returns {void}
   */
  closePanel(): void {
    this.panel?.dispose();
  }
}

export default PanelController;

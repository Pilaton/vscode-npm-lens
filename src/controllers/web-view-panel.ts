import * as vscode from "vscode";

import getPackageJson, { type IPackageJson } from "../utils/get-package-json";

import Context from "./context";

const errorStyle =
  "height: 100svh;font-size: 1.25rem;display: flex;justify-content: center;align-items: center;";

class WebViewPanelController {
  #panel: vscode.WebviewPanel | null = null;

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
        ? this.#getContentWithPackageJson(packageJson)
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

  #getContentWithPackageJson(packageJson: IPackageJson): string {
    const reactAppUri = this.#getReactAppUri();
    const versionExtension = this.#getVersionExtension();

    return `
      <script>
        window.packageJson = ${JSON.stringify(packageJson)};
        window.versionExtension = ${versionExtension};
        window.vscode = acquireVsCodeApi();
      </script>
      <div id="root"></div>
      <script src="${String(reactAppUri)}"></script>
    `;
  }

  #enablePanelWatcher() {
    this.#panel?.onDidDispose(() => {
      this.#panel = null;
    });
  }

  #enablePanelMessageWatcher() {
    const messageHandlers = {
      info: vscode.window.showInformationMessage,
      warning: vscode.window.showWarningMessage,
      error: vscode.window.showErrorMessage,
    };

    this.#panel?.webview.onDidReceiveMessage(
      ({
        type,
        text,
      }: {
        type: "info" | "warning" | "error";
        text: string;
      }) => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        messageHandlers[type](text);
      },
      undefined,
      this.#context.subscriptions,
    );
  }

  #getErrorHtml(message: string): string {
    return `<div style="${errorStyle}">${message}</div>`;
  }

  #buildHtml(content: string): string {
    return this.#webViewHtmlTemplate.replace("%%CONTENT%%", content);
  }

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

  #getVersionExtension(): string {
    const packageJSONExtension = this.#context.extension.packageJSON as {
      version: string;
    };
    return JSON.stringify(packageJSONExtension.version);
  }
}

export default WebViewPanelController;

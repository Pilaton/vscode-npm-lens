import type * as vscode from 'vscode';

export interface WebViewOptions {
  extensionUri: vscode.Uri;
  viewType: string;
  title: string;
  viewId: string;
}

const ERROR_STYLE =
  'height: 100svh;font-size: 1.25rem;display: flex;justify-content: center;align-items: center;';

/**
 * Generate error HTML message.
 */
export function getErrorHtml(message: string): string {
  return `<div style="${ERROR_STYLE}">${message}</div>`;
}

/**
 * Generate the webview HTML content.
 * Data is no longer injected here - it's sent via postMessage after webview loads.
 */
export function generateHtml(
  webview: vscode.Webview,
  scriptUri: vscode.Uri,
  title: string,
  errorMessage?: string
): string {
  const scriptSrc = webview.asWebviewUri(scriptUri).toString();
  const nonce = getNonce();

  // Content Security Policy
  const csp = [
    `default-src 'none'`,
    `style-src ${webview.cspSource} 'unsafe-inline'`,
    `script-src 'nonce-${nonce}'`,
    `font-src ${webview.cspSource}`,
    `img-src ${webview.cspSource} https: data:`,
    `connect-src https://registry.npmjs.org https://api.npmjs.org`,
  ].join('; ');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Security-Policy" content="${csp}">
      <title>${title}</title>
    </head>
    <body style="margin:0;padding:0;">
      ${errorMessage ?? ''}
      <div id="root"></div>
      <script nonce="${nonce}">
        window.vscode = acquireVsCodeApi();
      </script>
      <script nonce="${nonce}" src="${scriptSrc}"></script>
    </body>
    </html>`;
}

/**
 * Generate a random nonce for CSP.
 */
function getNonce(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let nonce = '';
  for (let i = 0; i < 32; i++) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonce;
}

import type { WebviewMessage } from 'src/shared/types/messages';

interface VsCodeWebviewApi {
  postMessage(message: WebviewMessage): void;
  getState(): unknown;
  setState(state: unknown): void;
}

declare global {
  interface Window {
    vscode: VsCodeWebviewApi;
  }
}

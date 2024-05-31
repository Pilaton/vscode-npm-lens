import type { ExtensionContext } from 'vscode';

const contextManager = (() => {
  let context: ExtensionContext;

  return {
    setContext(newContext: ExtensionContext): void {
      context = newContext;
    },
    getContext(): ExtensionContext {
      return context;
    },
  };
})();

export const { setContext, getContext } = contextManager;

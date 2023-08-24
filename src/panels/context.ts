import { ExtensionContext } from "vscode";

class Context {
  private static context: ExtensionContext;

  static setContext(ctx: ExtensionContext): void {
    this.context = ctx;
  }

  static getContext(): ExtensionContext {
    return this.context;
  }
}

export default Context;

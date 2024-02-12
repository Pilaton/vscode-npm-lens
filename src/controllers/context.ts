import { type ExtensionContext } from "vscode";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class Context {
  static #context: ExtensionContext;

  static setContext(context: ExtensionContext): void {
    this.#context = context;
  }

  static getContext(): ExtensionContext {
    return this.#context;
  }
}

export default Context;

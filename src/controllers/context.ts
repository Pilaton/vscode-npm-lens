import { type ExtensionContext } from "vscode";

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

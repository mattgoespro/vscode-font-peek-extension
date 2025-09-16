import * as events from "../shared/message/messages";

declare global {
  type ExtensionEvent = events[keyof events];

  /**
   * The `vscode` namespace provided by the webview host.
   */
  export interface VsCodeApi {
    postMessage<T extends ExtensionEvent>(message: T): void;
  }

  /**
   * Webview access to the `vscode` API for communicating with the extension.
   */
  interface Window {
    acquireVsCodeApi: () => VsCodeApi;
  }
}

export {};

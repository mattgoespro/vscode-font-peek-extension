import * as events from "../shared/events/messages";
console.log(events);
declare global {
  type ExtensionEvent = events[keyof events];

  /**
   * The `vscode` namespace provided by the webview host.
   */
  export interface VsCodeApi {
    postMessage<T extends ExtensionEvent>(message: Partial<MessageEvent<T>>): void;
  }

  /**
   * Webview access to the `vscode` API for communicating with the extension.
   */
  interface Window {
    acquireVsCodeApi: () => VsCodeApi;
  }
}

export {};

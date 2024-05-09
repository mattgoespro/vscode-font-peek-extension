import { WebviewReadyMessage } from "src/shared/event";

declare global {
  /**
   * The `vscode` namespace provided by the webview host.
   */
  interface VsCodeApi {
    postMessage<T extends WebviewReadyMessage>(message: Partial<MessageEvent<T>>): void;
  }

  /**
   * Webview access to the `vscode` API for communicating with the extension.
   */
  interface Window {
    acquireVsCodeApi: () => VsCodeApi;
  }
}

export {};

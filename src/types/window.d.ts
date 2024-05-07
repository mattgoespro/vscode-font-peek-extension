declare global {
  /**
   * The `vscode` namespace provided by the webview host.
   */
  interface VsCodeApi {
    postMessage(message: unknown): void;
  }

  /**
   * Webview access to the `vscode` API for communicating with the extension.
   */
  interface Window {
    acquireVsCodeApi: () => VsCodeApi;
  }
}

export {};

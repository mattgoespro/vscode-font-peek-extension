import vscode from "vscode";
import html from "../webview/index.html";
import { Logger, createLogger } from "@shared/logging";
import {
  LoadFontEvent,
  WebviewLogOutputEvent,
  WebviewStateChangedEvent
} from "@shared/message/messages";
import path from "path";

export class EditorFontDocument implements vscode.CustomDocument {
  private webviewPanel: vscode.WebviewPanel;

  private log: Logger;

  constructor(
    private context: vscode.ExtensionContext,
    readonly uri: vscode.Uri,
    outputChannel: vscode.OutputChannel
  ) {
    this.log = createLogger("EditorFontDocument", outputChannel.appendLine);
  }

  /**
   * Creates a custom editor for the given webview panel and font document
   * once the document content has been loaded.
   *
   * @param webviewPanel The webview panel to associate with the editor.
   * @param document The font document to display in the editor.
   */
  public async createWebview(webviewPanel: vscode.WebviewPanel) {
    this.webviewPanel = webviewPanel;
    this.webviewPanel.webview.options = {
      enableScripts: true,
      enableCommandUris: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri, "dist"), // the folder where the extension webview scripts and styles are located
        vscode.Uri.joinPath(this.context.extensionUri, "..") // the folder where this document (i.e. the font file) is located
      ]
    };
    this.webviewPanel.webview.html = this.formatWebviewTemplateContents(html, {
      webviewScriptUri: this.toRelativeWebviewUri("dist", "webview.js"),
      webviewStyleSheetUri: this.toRelativeWebviewUri("dist", "webview.css")
    });

    this.webviewPanel.webview.onDidReceiveMessage(
      (event: WebviewStateChangedEvent | WebviewLogOutputEvent) => {
        console.log("Received message from webview:", event);
        const { name, payload } = event;

        switch (name) {
          case "log-output": {
            this.log.info(payload);
            break;
          }
          case "webview-state-changed": {
            if (payload.state !== "ready") {
              return;
            }

            /**
             * The webview is ready to receive and render the font preview.
             */
            try {
              console.log("Local resource roots:");
              for (const root of [
                vscode.Uri.joinPath(this.context.extensionUri, "dist"),
                vscode.Uri.file(path.dirname(this.uri.fsPath))
              ]) {
                console.log(root.toString(), root.fsPath);
              }
              this.webviewPanel.webview.postMessage<LoadFontEvent>({
                name: "load-font",
                payload: {
                  fileUri: this.webviewPanel.webview.asWebviewUri(this.uri).toString()
                }
              });
            } catch (error) {
              this.log.error("Failed to load font glyphs.", error);

              vscode.window.showErrorMessage(
                `Failed to load font glyphs: ${error instanceof Error ? error.message : error}`
              );
            }
          }
        }
      },
      this.context.subscriptions
    );
  }

  private toRelativeWebviewUri(...path: string[]) {
    return this.webviewPanel.webview
      .asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, ...path))
      .toString();
  }

  private formatWebviewTemplateContents(content: string, data: Record<string, string>): string {
    let html = content;

    Object.entries(data).forEach(([key, value]) => {
      html = html.replace(`{{ ${key} }}`, value);
    });

    return html;
  }

  public async readWebviewTemplate() {
    const fontFileData = await vscode.workspace.fs.readFile(this.uri);
    console.log(fontFileData instanceof Uint8Array);
    console.log(fontFileData instanceof ArrayBuffer);
    console.log(fontFileData instanceof Buffer);
    return fontFileData.buffer;
  }

  dispose(): void {
    this.webviewPanel.dispose();
  }
}

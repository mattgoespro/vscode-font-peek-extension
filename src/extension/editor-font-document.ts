import { Logger, createLogger } from "@shared/logging";
import {
  LoadFontEvent,
  WebviewLogOutputEvent,
  WebviewStateChangedEvent
} from "@shared/message/messages";
import vscode from "vscode";
import html from "../webview/index.html";

export class EditorFontDocument implements vscode.CustomDocument {
  private readonly output: Logger;

  private webviewPanel: vscode.WebviewPanel;

  constructor(
    private context: vscode.ExtensionContext,
    readonly uri: vscode.Uri,
    readonly outputChannel: vscode.OutputChannel
  ) {
    this.output = createLogger("EditorFontDocument", {
      printer: outputChannel.appendLine
    });
  }

  /**
   * Creates a custom editor for the given webview panel and font document
   * once the document content has been loaded.
   *
   * @param webviewPanel The webview panel to associate with the editor.
   * @param document The font document to display in the editor.
   */
  public async loadPanelWebview(webviewPanel: vscode.WebviewPanel) {
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
      webviewScriptUri: this.toRelativeWebviewUri("dist", "webview.js")
    });

    this.webviewPanel.webview.onDidReceiveMessage(
      (event: WebviewStateChangedEvent | WebviewLogOutputEvent) => {
        this.output.info("Received event from webview:", event);

        const { name, payload } = event;

        switch (name) {
          case "log-output": {
            this.output.info(payload);
            break;
          }
          case "webview-state-changed": {
            if (payload.state !== "ready") {
              return;
            }

            this.webviewPanel.webview.postMessage<LoadFontEvent>({
              name: "load-font",
              payload: {
                fileUri: this.webviewPanel.webview.asWebviewUri(this.uri).toString()
              }
            });
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

    for (const [key, value] of Object.entries(data)) {
      const matcher = new RegExp(`{{\\s*${key}\\s*}}`, "g"); //

      if (!matcher.test(html)) {
        this.output.warn(`Webview template key not found: ${key}`);
        continue;
      }

      html = html.replace(matcher, value);
    }

    return html;
  }

  dispose(): void {
    this.webviewPanel.dispose();
  }
}

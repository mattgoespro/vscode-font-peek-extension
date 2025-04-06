import vscode from "vscode";
import html from "../webview/index.html";
import { FontSpec } from "../shared/model";
import { EditorMessage } from "../shared/events/messages";
import { loadFont } from "@shared/model";
import { createLogger, Logger } from "../shared/logging/logger";

export class EditorFontDocument implements vscode.CustomDocument {
  private contents: ArrayBuffer;
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
    this.contents = await this.readWebviewTemplate();
    this.log.info("Loaded font document contents.", this.contents);

    this.webviewPanel = webviewPanel;
    this.webviewPanel.webview.options = {
      enableScripts: true,
      enableCommandUris: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri, "dist"),
        vscode.Uri.file(this.uri.path)
      ]
    };
    this.webviewPanel.webview.html = this.formatWebviewTemplateContents(html, {
      webviewScriptUri: this.toWebviewUri("dist", "webview.js"),
      webviewStyleSheetUri: this.toWebviewUri("dist", "webview.css"),
      fontDataUri: this.getFontDataWebviewUri()
    });

    this.webviewPanel.webview.onDidReceiveMessage(
      (event: MessageEvent<EditorMessage<"webview">>) => {
        const { data } = event;
        const { payload } = data;

        switch (data.name) {
          case "log-output": {
            this.log.info(payload);
            break;
          }
          case "webview-state-changed": {
            if (data.payload.state !== "ready") {
              return;
            }

            /**
             * The webview is ready to receive and render the font preview.
             */
            try {
              this.log.info("Loading font...", this.contents);
              const fontData: FontSpec = loadFont(this.contents);
              this.webviewPanel.webview.postMessage<EditorMessage<"extension">>({
                source: "extension",
                name: "font-glyphs-loaded",
                payload: {
                  fontData
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

  private toWebviewUri(...path: string[]) {
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
    return fontFileData.buffer;
  }

  public getFontDataBase64() {
    return Buffer.from(this.contents).toString("base64");
  }

  private getFontDataWebviewUri() {
    return `data:font/ttf;base64,${this.getFontDataBase64()}`;
  }

  dispose(): void {
    this.webviewPanel.dispose();
  }
}

import vscode from "vscode";
import html from "../webview/index.html";
import { Subject, Subscription } from "rxjs";
import { FontGlyph } from "../shared/model";
import { EditorMessage } from "../shared/events/messages";
import { loadFont } from "./font";
import { createLogger } from "../shared/logging/logger";

export class EditorFontDocument implements vscode.CustomDocument {
  private contents: Buffer;
  private webviewPanel: vscode.WebviewPanel;
  private previewReady$: Subject<boolean> = new Subject();

  private subscriptions: Subscription[] = [];
  private log = createLogger("EditorFontDocument");

  constructor(
    private context: vscode.ExtensionContext,
    readonly uri: vscode.Uri,
    private outputChannel: vscode.OutputChannel
  ) {}

  /**
   * Creates a custom editor for the given webview panel and font document
   * once the document content has been loaded.
   *
   * @param webviewPanel The webview panel to associate with the editor.
   * @param document The font document to display in the editor.
   */
  public async createWebview(webviewPanel: vscode.WebviewPanel) {
    this.contents = await this.loadContents();

    this.webviewPanel = webviewPanel;
    this.webviewPanel.webview.options = {
      enableScripts: true,
      enableCommandUris: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.context.extensionUri, "dist"),
        vscode.Uri.file(this.uri.path)
      ]
    };
    this.webviewPanel.webview.html = this.formatWebviewTemplate(html, {
      webviewScriptUri: this.webviewPanel.webview
        .asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "dist", "webview.js"))
        .toString(),
      webviewStyleSheetUri: this.webviewPanel.webview
        .asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, "dist", "webview.css"))
        .toString(),
      fontDataUri: this.getFontDataWebviewUri()
    });

    this.webviewPanel.webview.onDidReceiveMessage(
      (event: MessageEvent<EditorMessage<"webview">>) => {
        switch (event.data.name) {
          case "log-output": {
            const logger = createLogger("Webview");
            this.outputChannel.appendLine(logger.createLogMessage(event.data.args, true));
            break;
          }
          case "webview-state-changed":
            if (event.data.state === "ready") {
              this.previewReady$.next(true);
            }
        }
      },
      this.context.subscriptions
    );

    this.context.subscriptions.push(this.webviewPanel);

    /**
     * Wait for webview ready state before sending font data.
     */
    this.subscriptions.push(
      this.previewReady$.subscribe(async () => {
        const glyphs: FontGlyph[] = loadFont(this.contents);
        this.webviewPanel.webview.postMessage<EditorMessage<"extension">>({
          source: "extension",
          name: "font-glyphs-loaded",
          glyphs
        });
      })
    );
  }

  private formatWebviewTemplate(content: string, data: Record<string, string>): string {
    let html = content;

    Object.entries(data).forEach(([key, value]) => {
      html = html.replace(`{{ ${key} }}`, value);
    });

    return html;
  }

  public async loadContents() {
    const fontData = await vscode.workspace.fs.readFile(this.uri);
    return Buffer.from(fontData);
  }

  public getFontDataBase64() {
    return this.contents.toString("base64");
  }

  private getFontDataWebviewUri() {
    return `data:font/ttf;base64,${this.getFontDataBase64()}`;
  }

  public dispose(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}

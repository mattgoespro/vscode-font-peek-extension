import { dirname, join } from "path";
import vscode, { ExtensionContext } from "vscode";
import html from "../webview/index.html";
import { Subject, Subscription } from "rxjs";
import { FontGlyph } from "../shared/model";
import { EditorMessage } from "../shared/events/messages";
import { loadFont } from "./font";
import { createLogger } from "../shared/logging/logger";
import { FormattedError } from "../shared/logging/formatted-error";

class FontGlyphPreviewError extends FormattedError {
  constructor(message: string) {
    super(message);
  }

  protected getFormattedMessage(message: string): string {
    return message;
  }
}

export class FontDocument implements vscode.CustomDocument {
  private contents: Buffer;
  private webviewPanel: vscode.WebviewPanel;
  private webviewScriptUri: vscode.Uri;
  private webviewStylesheetUri: vscode.Uri;
  private previewReady$: Subject<boolean> = new Subject();

  private subscriptions: Subscription[] = [];
  private disposables: vscode.Disposable[] = [];
  private logger = createLogger("FontDocument");

  constructor(
    private context: vscode.ExtensionContext,
    readonly uri: vscode.Uri,
    private outputChannel: vscode.OutputChannel
  ) {
    this.webviewScriptUri = vscode.Uri.file(
      join(this.context.extensionPath, "dist", "webview.js")
    ).with({ scheme: "vscode-resource" });
    this.webviewStylesheetUri = vscode.Uri.file(
      join(this.context.extensionPath, "dist", "webview.css")
    ).with({ scheme: "vscode-resource" });
  }

  protected async readFile(uri: vscode.Uri) {
    if (uri.scheme === "untitled") {
      this.contents = Buffer.from([]);
    }

    const fontData = await vscode.workspace.fs.readFile(uri);
    this.contents = Buffer.from(fontData);
  }

  static async create(
    context: ExtensionContext,
    uri: vscode.Uri,
    outputChannel: vscode.OutputChannel
  ) {
    const document = new FontDocument(context, uri, outputChannel);
    await document.readFile(uri);
    return document;
  }

  public async initWebview(webviewPanel: vscode.WebviewPanel) {
    await this.createWebview(webviewPanel);
  }

  /**
   * Creates a custom editor for the given webview panel and font document.
   * @param webviewPanel The webview panel to associate with the editor.
   * @param document The font document to display in the editor.
   */
  private async createWebview(webviewPanel: vscode.WebviewPanel) {
    await this.buildWebview(webviewPanel);
    this.addWebviewEventListeners();
  }

  /**
   * Sets and configures the webview panel for the preview of the font document.
   *
   * @param webviewPanel The webview panel to set.
   * @param document The font document associated with the webview panel.
   */
  private async buildWebview(webviewPanel: vscode.WebviewPanel) {
    this.webviewPanel = webviewPanel;
    this.webview.options = {
      enableScripts: true,
      enableCommandUris: true,
      localResourceRoots: [
        vscode.Uri.file(join(this.context.extensionPath, "dist")),
        vscode.Uri.file(dirname(this.uri.path))
      ]
    };
    this.webview.html = this.injectWebviewContent();
    this.disposables.push(this.webviewPanel);

    /**
     * Wait for webview ready state before sending font data.
     */
    this.subscriptions.push(
      this.previewReady$.subscribe(async () => {
        const glyphs: FontGlyph[] = loadFont(this.contents);
        this.webview.postMessage<EditorMessage<"extension">>({
          source: "extension",
          name: "font-glyphs-loaded",
          glyphs
        });
      })
    );
  }

  private addWebviewEventListeners() {
    this.webview.onDidReceiveMessage((event: MessageEvent<EditorMessage<"webview">>) => {
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
    }, this.disposables);
  }

  private injectWebviewContent(): string {
    return this.interpolateTemplateVariables(html, {
      webviewScriptUri: this.webviewScriptUri.toString(),
      webviewStylesheetUri: this.webviewStylesheetUri.toString(),
      webviewFontDataUri: this.getFontDataWebviewUri().toString()
    });
  }

  private interpolateTemplateVariables(content: string, data: Record<string, string>): string {
    let html = content;

    Object.entries(data).forEach(([key, value]) => {
      html = html.replace(`{{ ${key} }}`, value);
    });

    return html;
  }

  private get webview(): vscode.Webview {
    if (this.webviewPanel == null) {
      vscode.window.showErrorMessage("Webview panel not initialized.");
      this.outputChannel.appendLine(
        this.logger.createLogMessage(
          new FontGlyphPreviewError("Webview panel not initialized"),
          true
        )
      );
    }

    return this.webviewPanel.webview;
  }

  public getFontDataBase64() {
    return this.contents.toString("base64");
  }

  private getFontDataWebviewUri() {
    return `data:font/ttf;base64,${this.getFontDataBase64()}`;
  }

  public dispose(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.disposables.forEach((disposable) => disposable.dispose());
  }
}

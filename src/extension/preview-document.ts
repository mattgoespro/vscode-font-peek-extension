import { dirname, join } from "path";
import { Subject, Subscription } from "rxjs";
import vscode, { ExtensionContext } from "vscode";
import { EditorMessage, MessageContext } from "../shared/events/messages";
import { FormattedError } from "../shared/logging/formatted-error";
import { createLogger } from "../shared/logging/logger";
import { FontGlyph } from "../shared/model";
import webviewTemplate from "../webview/index.html";
import { loadFont } from "./model";

class FontGlyphPreviewError extends FormattedError {
  constructor(message: string) {
    super(message);
  }

  protected getFormattedMessage(message: string): string {
    return message;
  }
}

export class PreviewDocument implements vscode.CustomDocument {
  private contents: Buffer;
  private webviewPanel: vscode.WebviewPanel;
  private webviewScriptUri: vscode.Uri;
  private webviewStylesheetUri: vscode.Uri;
  private previewReady$: Subject<boolean> = new Subject();

  private subscriptions: Subscription[] = [];
  private disposables: vscode.Disposable[] = [];
  private runtimeLogger = createLogger("FontDocument: Runtime");
  private webviewLogger = createLogger("FontDocument: Document");

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
    const document = new PreviewDocument(context, uri, outputChannel);
    await document.readFile(uri);
    return document;
  }

  /**
   * Creates a custom editor for the given webview panel and font document.
   * @param webviewPanel The webview panel to associate with the editor.
   * @param document The font document to display in the editor.
   */
  public async createWebview(webviewPanel: vscode.WebviewPanel) {
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
    this.webview.html = this.formatWebviewTemplate(webviewTemplate);
    this.disposables.push(this.webviewPanel);

    /**
     * Wait for webview to be ready before sending font data to render.
     */
    this.subscriptions.push(
      this.previewReady$.subscribe(async () => {
        try {
          const glyphs: FontGlyph[] = loadFont(this.outputChannel, this.contents);

          this.webview.postMessage<EditorMessage<"extension">>({
            source: "extension",
            name: "font-glyphs-loaded",
            glyphs
          });
        } catch (error) {
          vscode.window.showErrorMessage(
            ["Failed to open font preview.", error.message].join("\n")
          );
        }
      })
    );
  }

  private logOutput(context: MessageContext, ...args: unknown[]) {
    const output = this.outputChannel.appendLine;

    switch (context) {
      case "webview": {
        output(this.webviewLogger.createLogMessage(args));
        break;
      }
      case "extension": {
        output(this.runtimeLogger.createLogMessage(args));
        break;
      }
    }
  }

  private addWebviewEventListeners() {
    this.webview.onDidReceiveMessage((event: MessageEvent<EditorMessage<"webview">>) => {
      const { data: messageData } = event;

      switch (messageData.name) {
        case "log-output": {
          this.logOutput("webview", messageData.args);
          break;
        }
        case "webview-state-changed": {
          if (messageData.state === "ready") {
            this.logOutput("webview", "Webview ready.");
            this.previewReady$.next(true);
            return;
          }

          this.logOutput("webview", "Waiting for webview to be ready...");
          break;
        }
        case "notify": {
          switch (messageData.level) {
            case "info":
              vscode.window.showInformationMessage(messageData.message);
              break;
            case "warn":
              vscode.window.showWarningMessage(
                messageData.message,
                `${messageData.level}: ${messageData.message}`
              );
              break;
            case "error":
              vscode.window.showErrorMessage(
                messageData.message,
                messageData.level,
                messageData.name,
                messageData.source
              );
              break;
          }
        }
      }
    }, this.disposables);
  }

  private formatWebviewTemplate(content: string): string {
    let html = content;
    const templateVariables = {
      webviewScriptUri: this.webviewScriptUri.toString(),
      webviewStylesheetUri: this.webviewStylesheetUri.toString(),
      webviewFontDataUri: this.getFontDataWebviewUri().toString()
    };

    Object.entries(templateVariables).forEach(([key, value]) => {
      html = html.replace(`{{ ${key} }}`, value);
    });

    return html;
  }

  private get webview(): vscode.Webview {
    if (this.webviewPanel == null) {
      vscode.window.showErrorMessage("Webview panel not initialized.");
      this.outputChannel.appendLine(
        this.runtimeLogger.createLogMessage(
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

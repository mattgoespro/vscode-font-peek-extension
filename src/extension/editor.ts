import { dirname, join } from "path";
import vscode, { OutputChannel } from "vscode";
import html from "../preview/Preview.html";
import { WebviewStateMessage } from "../shared/events/messages";
import { FontGlyph } from "../shared/model";
import { output } from "../shared/output";
import { FontDocument } from "./document";
import { loadFont } from "./font";

export class FontPreviewDocumentProvider
  implements vscode.CustomReadonlyEditorProvider<FontDocument>
{
  private webviewPanel: vscode.WebviewPanel;
  private webviewScriptUri: vscode.Uri;
  private webviewStylesheetUri: vscode.Uri;
  private disposables: vscode.Disposable[] = [];

  constructor(
    private readonly context: vscode.ExtensionContext,
    private outputChannel: vscode.OutputChannel
  ) {
    this.webviewScriptUri = vscode.Uri.file(
      join(this.context.extensionPath, "dist", "preview.js")
    ).with({ scheme: "vscode-resource" });
    this.webviewStylesheetUri = vscode.Uri.file(
      join(this.context.extensionPath, "dist", "preview.css")
    ).with({ scheme: "vscode-resource" });
  }

  /**
   * Registers the font preview custom editor provider.
   * @param context The extension context.
   */
  static register(
    context: vscode.ExtensionContext,
    outputChannel: OutputChannel
  ): vscode.Disposable {
    return vscode.window.registerCustomEditorProvider(
      "fontGlyphPreview.editor.preview",
      new FontPreviewDocumentProvider(context, outputChannel),
      {
        supportsMultipleEditorsPerDocument: true,
        webviewOptions: {
          retainContextWhenHidden: true
        }
      }
    );
  }

  /**
   * Resolves the font preview webview for the given font file.
   *
   * @param document - The document holding the font data to be resolved.
   * @param webviewPanel - The webview panel to be created for the font preview.
   * @param _ - The cancellation token.
   */
  async resolveCustomEditor(
    document: FontDocument,
    webviewPanel: vscode.WebviewPanel,
    _: vscode.CancellationToken
  ): Promise<void> {
    try {
      await this.createCustomEditor(webviewPanel, document);
    } catch (error) {
      document.dispose();
      webviewPanel.dispose();

      vscode.window.showErrorMessage("Failed to create custom editor.", error);
    }
  }

  private onWebviewReady() {
    return Promise.race([
      new Promise<void>((resolve) => {
        this.webview.onDidReceiveMessage((event: MessageEvent<WebviewStateMessage>) => {
          if (event.data.state === "ready") {
            resolve();
          }
        }, this.disposables);
      }),
      new Promise<void>((resolve) => setTimeout(resolve, 30000))
    ]);
  }

  private listenForWebviewMessages() {
    this.webview.onDidReceiveMessage((event: MessageEvent) => {
      if (event.data.type === "log") {
        output(this.outputChannel, "webview", event.data.args);
      }
    }, this.disposables);
  }

  /**
   * Creates a new FontDocument from the given font file URI.
   *
   * @param uri - The URI of the document to open.
   * @param _openContext - The open context for the document.
   * @param _token - The cancellation token.
   * @returns The opened FontDocument or a promise that resolves to the opened FontDocument.
   */
  openCustomDocument(
    uri: vscode.Uri,
    _openContext: vscode.CustomDocumentOpenContext,
    _token: vscode.CancellationToken
  ): FontDocument | Thenable<FontDocument> {
    return FontDocument.create(uri);
  }

  /**
   * Creates a custom editor for the given webview panel and font document.
   * @param webviewPanel The webview panel to associate with the editor.
   * @param document The font document to display in the editor.
   */
  private async createCustomEditor(webviewPanel: vscode.WebviewPanel, document: FontDocument) {
    await this.setWebviewPanel(webviewPanel, document);
    await this.createWebview(document);
    this.listenForWebviewMessages();
  }

  /**
   * Sets and configures the webview panel for the preview of the font document.
   *
   * @param webviewPanel The webview panel to set.
   * @param document The font document associated with the webview panel.
   */
  private async setWebviewPanel(webviewPanel: vscode.WebviewPanel, document: FontDocument) {
    this.webviewPanel = webviewPanel;
    this.webview.options = {
      enableScripts: true,
      enableCommandUris: true,
      localResourceRoots: [
        vscode.Uri.file(join(this.context.extensionPath, "dist")),
        vscode.Uri.file(dirname(document.uri.path))
      ]
    };
  }

  /**
   * Sets the font preview's webview from the given font document.
   * @param document The font document to display in the webview.
   */
  private async createWebview(document: FontDocument) {
    this.webview.html = this.formatFontDocument(document);
    vscode.debug.activeDebugConsole.appendLine("Set webview content.");

    /**
     * Wait for the webview to load before sending the font data.
     */
    await this.onWebviewReady();

    const glyphs: FontGlyph[] = loadFont(document.getFontData());
    this.webview.postMessage({ glyphs });
  }

  private formatFontDocument(document: FontDocument): string {
    return this.replaceHtmlVariables(html, {
      webviewScriptUri: this.webviewScriptUri.toString(),
      webviewStylesheetUri: this.webviewStylesheetUri.toString(),
      webviewFontDataUri: document.getFontDataWebviewUri().toString()
    });
  }

  private replaceHtmlVariables(content: string, data: Record<string, string>): string {
    let html = content;

    Object.entries(data).forEach(([key, value]) => {
      html = html.replace(`{{ ${key} }}`, `${value}`);
    });

    return html;
  }

  private get webview(): vscode.Webview {
    if (this.webviewPanel == null) {
      vscode.window.showErrorMessage("Webview panel not initialized.");
      output(
        this.outputChannel,
        "extension",
        module.id,
        new Error("Webview panel not initialized.")
      );
    }

    return this.webviewPanel.webview;
  }
}

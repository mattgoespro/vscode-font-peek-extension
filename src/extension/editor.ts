import { join, dirname } from "path";
import vscode from "vscode";
import html from "../preview/preview.html";
import { WebviewReadyMessage } from "../shared/event";
import { FontGlyph } from "../shared/model";
import { TTFDocument } from "./document";
import { loadFont } from "./font";

export class FontPreviewWebviewProvider
  implements vscode.CustomReadonlyEditorProvider<TTFDocument>
{
  private webviewPanel: vscode.WebviewPanel;

  constructor(private readonly context: vscode.ExtensionContext) {}

  static register(context: vscode.ExtensionContext): vscode.Disposable {
    return vscode.window.registerCustomEditorProvider(
      "fontGlyphPreview.editor.preview",
      new FontPreviewWebviewProvider(context),
      {
        supportsMultipleEditorsPerDocument: true,
        webviewOptions: {
          retainContextWhenHidden: true
        }
      }
    );
  }

  private waitForWebview() {
    return Promise.race([
      new Promise<void>((resolve) => {
        this.webview.onDidReceiveMessage((event: MessageEvent<WebviewReadyMessage>) => {
          if (event.data.state === "ready") {
            resolve();
          }
        });
      }),
      new Promise<void>((resolve) => setTimeout(resolve, 10000))
    ]);
  }

  openCustomDocument(
    uri: vscode.Uri,
    _openContext: vscode.CustomDocumentOpenContext,
    _token: vscode.CancellationToken
  ): TTFDocument | Thenable<TTFDocument> {
    return TTFDocument.create(uri);
  }

  private get webview(): vscode.Webview {
    if (this.webviewPanel == null) {
      vscode.window.showErrorMessage("Webview panel not ready.");
      throw new Error("Webview panel not ready.");
    }

    return this.webviewPanel.webview;
  }

  async resolveCustomEditor(
    document: TTFDocument,
    webviewPanel: vscode.WebviewPanel,
    _: vscode.CancellationToken
  ): Promise<void> {
    await this.setWebviewPanel(webviewPanel, document);
  }

  private async setWebviewPanel(webviewPanel: vscode.WebviewPanel, document: TTFDocument) {
    this.webviewPanel = webviewPanel;
    this.webview.options = {
      enableScripts: true,
      enableCommandUris: true,
      localResourceRoots: [
        vscode.Uri.file(join(this.context.extensionPath, "dist")),
        vscode.Uri.file(dirname(document.uri.path))
      ]
    };

    await this.initWebview(document);
  }

  private async initWebview(document: TTFDocument) {
    this.webview.html = this.getWebviewContent(document);
    vscode.debug.activeDebugConsole.appendLine("Webview content set.");
    await this.waitForWebview();

    let glyphs: FontGlyph[] = loadFont(document.getFontData());
    this.webview.postMessage({ glyphs });
  }

  private getWebviewContent(document: TTFDocument): string {
    const previewScriptPath = vscode.Uri.file(
      join(this.context.extensionPath, "dist", "preview.js")
    );
    const previewStylesPath = vscode.Uri.file(
      join(this.context.extensionPath, "dist", "preview.css")
    );
    const previewScriptUri = previewScriptPath.with({ scheme: "vscode-resource" }).toString();

    const previewWebviewStylesheetUri = previewStylesPath
      .with({ scheme: "vscode-resource" })
      .toString();

    return this.replaceHtmlVariables(html, {
      previewScriptUri,
      previewWebviewStylesheetUri,
      previewFontDataUri: document.getFontDataWebviewUri().toString()
    });
  }

  private replaceHtmlVariables(content: string, data: Record<string, string>): string {
    let html = content;

    Object.entries(data).forEach(([key, value]) => {
      html = html.replace(`{{ ${key} }}`, `${value}`);
    });

    return html;
  }
}

import vscode from "vscode";
import { FontGlyph } from "../shared/model";
import { Font, create } from "fontkit";
import { WebviewReadyMessage } from "../shared/event";
import path from "path";
import html from "../preview/index.html";
import { TTFDocument } from "./document";

export class TTFEditorProvider implements vscode.CustomReadonlyEditorProvider<TTFDocument> {
  private webviewPanel: vscode.WebviewPanel;

  constructor(private readonly context: vscode.ExtensionContext) {}

  static register(context: vscode.ExtensionContext): vscode.Disposable {
    return vscode.window.registerCustomEditorProvider(
      "fontGlyphPreview.editor.preview",
      new TTFEditorProvider(context),
      {
        supportsMultipleEditorsPerDocument: true,
        webviewOptions: {
          retainContextWhenHidden: true
        }
      }
    );
  }

  private syncWithWebview() {
    return Promise.race([
      new Promise<void>((resolve) => {
        this.webview.onDidReceiveMessage((event: MessageEvent<WebviewReadyMessage>) => {
          console.log("Received message from webview: ", event);

          if (event.data.state === "ready") {
            console.log("Webview is ready");
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
    this.webviewPanel = webviewPanel;
    this.webview.options = {
      enableScripts: true,
      enableCommandUris: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(this.context.extensionPath, "dist")),
        vscode.Uri.file(path.dirname(document.uri.path))
      ]
    };

    let glyphs: FontGlyph[] = [];

    const fontData = Buffer.from(document.documentData);
    const font = create(fontData) as Font;
    glyphs = this.getFontGlyphs(font);

    this.webview.html = this.getWebviewContent(document);

    await this.syncWithWebview();

    this.webview.postMessage({ glyphs });
  }

  private getWebviewContent(document: TTFDocument): string {
    const previewScriptPath = vscode.Uri.file(
      path.join(this.context.extensionPath, "dist", "preview.js")
    );
    const previewStylesPath = vscode.Uri.file(
      path.join(this.context.extensionPath, "dist", "preview.css")
    );

    const previewScriptUri = previewScriptPath.with({ scheme: "vscode-resource" }).toString();
    const previewStylesheetUri = previewStylesPath.with({ scheme: "vscode-resource" }).toString();
    const previewFontDataUri = vscode.Uri.parse(document.uri.toString())
      .with({
        scheme: "vscode-resource"
      })
      .toString();

    return this.interpolateKeys(html, {
      previewScriptUri,
      previewStylesheetUri,
      previewFontDataUri
    });
  }

  private interpolateKeys(content: string, data: Record<string, string>): string {
    let html = content;

    Object.entries(data).forEach(([key, value]) => {
      html = html.replace(`{{ ${key} }}`, `${value}`);
    });

    return html;
  }

  private getFontGlyphs(font: Font) {
    const glyphs: FontGlyph[] = [];

    for (let i = 0; i < font.characterSet.length; i++) {
      const glyph = font.glyphForCodePoint(font.characterSet[i]);
      const id = glyph.id;
      const name = glyph.name;
      const hex = glyph.codePoints[0].toString(16);
      const unicode = `&#x${hex}`;
      const htmlEncoded = `\\u${hex};`;

      glyphs.push({
        id,
        name,
        hex,
        unicode,
        html: htmlEncoded
      });
    }

    return glyphs;
  }
}

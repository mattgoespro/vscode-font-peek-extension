import path from "path";
import { Font, create } from "fontkit";
import vscode from "vscode";
import html from "../preview/preview.html";
import { WebviewReadyMessage } from "../shared/event";
import { FontGlyph } from "../shared/model";
import { TTFDocument } from "./document";

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

  private syncWithWebview() {
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
    this.webviewPanel = webviewPanel;
    this.webview.options = {
      enableScripts: true,
      enableCommandUris: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(this.context.extensionPath, "dist")),
        vscode.Uri.file(path.dirname(document.uri.path))
      ]
    };

    const font = create(document.getFontData()) as Font;
    let glyphs: FontGlyph[] = this.getFontGlyphs(font);

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

    const previewWebviewStylesheetUri = previewStylesPath
      .with({ scheme: "vscode-resource" })
      .toString();

    return this.interpolateHtmlKeys(html, {
      previewScriptUri,
      previewWebviewStylesheetUri,
      previewFontDataUri: document.getFontDataWebviewUri().toString()
    });
  }

  private interpolateHtmlKeys(content: string, data: Record<string, string>): string {
    let html = content;

    Object.entries(data).forEach(([key, value]) => {
      html = html.replace(`{{ ${key} }}`, `${value}`);
    });

    return html;
  }

  private getFontGlyphs(font: Font) {
    const MAX_GLYPH_STRING_LENGTH = 3;
    const glyphs: FontGlyph[] = [];

    for (let i = 0; i < font.characterSet.length; i++) {
      const glyph = font.glyphForCodePoint(font.characterSet[i]);

      const id = glyph.id;
      const name = glyph.name;
      const binary = glyph.codePoints[0];
      const hex = `&#x${binary.toString(16)}`;
      const unicode = String.fromCodePoint(binary);

      const glyphString = font.stringsForGlyph(glyph.id);

      if (glyphString.length > MAX_GLYPH_STRING_LENGTH) {
        console.log("Glyph string too long: ", glyphString);
        continue;
      }

      glyphs.push({
        id,
        name,
        binary: `\\u${binary.toString(16)}`,
        unicode,
        hex
      });
    }

    return glyphs;
  }
}

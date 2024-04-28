import vscode from "vscode";
import { Disposable } from "./dispose";
import { FontGlyph } from "../shared/model";
import { Font, create } from "fontkit";
import { getExtensionWebviewContent, getExtensionWebviewErrorContent } from "./editor-content";
import { WebviewReadyMessage } from "../shared/event";

export class TTFEditorProvider implements vscode.CustomReadonlyEditorProvider<TTFDocument> {
  private webviewPanel: vscode.WebviewPanel;

  constructor(private readonly _context: vscode.ExtensionContext) {}

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
        this.webviewPanel.webview.onDidReceiveMessage(
          (event: MessageEvent<WebviewReadyMessage>) => {
            console.log("Received message from webview: ", event);

            if (event.data.state === "ready") {
              console.log("Webview is ready");
              resolve();
            }
          }
        );
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

  async resolveCustomEditor(
    document: TTFDocument,
    webviewPanel: vscode.WebviewPanel,
    _: vscode.CancellationToken
  ): Promise<void> {
    this.webviewPanel = webviewPanel;
    this.webviewPanel.webview.options = {
      enableScripts: true
    };

    let glyphs: FontGlyph[] = [];

    try {
      const font = create(Buffer.from(document.documentData)) as Font;
      console.log("Created font:");
      console.log("\tName:", font.fullName);
      console.log("\tFamily:", font.familyName);
      console.log("\tCharacter points:", font.characterSet);
      glyphs = this.getFontGlyphs(font);

      this.webviewPanel.webview.html = getExtensionWebviewContent(
        this._context.extensionPath,
        this.webviewPanel.webview
      );

      await this.syncWithWebview();

      this.webviewPanel.webview.postMessage({ glyphs });
    } catch (error) {
      webviewPanel.webview.html = getExtensionWebviewErrorContent(webviewPanel.webview, error);
      console.error(error);
    }
  }

  private getFontGlyphs(font: Font) {
    const glyphs: FontGlyph[] = [];

    for (let i = 0; i < font.characterSet.length; i++) {
      const unencoded = font.characterSet[i].toString(16);
      console.log("Unencoded:", unencoded);
      const unicode = `&#x${unencoded}`;
      console.log("Unicode:", unicode);
      const htmlEncoded = `\\u${unicode};`;
      console.log("HTML encoded:", htmlEncoded);
      // console.log({
      //   name: glyph.name,
      //   unicode,
      //   unencoded,
      //   htmlEncoded
      // });
      glyphs.push({
        name: "test",
        unicode,
        unencoded,
        htmlEncoded
      });
    }

    return glyphs;
  }
}

class TTFDocument extends Disposable implements vscode.CustomDocument {
  constructor(public readonly uri: vscode.Uri, private initialContent: Uint8Array) {
    super();
  }

  private static async readFile(uri: vscode.Uri): Promise<Uint8Array> {
    if (uri.scheme === "untitled") {
      return new Uint8Array();
    }

    return vscode.workspace.fs.readFile(uri);
  }

  static async create(uri: vscode.Uri) {
    const fileData = await TTFDocument.readFile(uri);
    return new TTFDocument(uri, fileData);
  }

  public get documentData(): Uint8Array {
    return this.initialContent;
  }
}

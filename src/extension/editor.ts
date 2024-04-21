import vscode from "vscode";
import { Disposable } from "./dispose";
import { Font, TTF, woff2 } from "fonteditor-core";
import { inflate } from "pako";
import { Glyph } from "./glyph";
import path from "path";

export class TTFEditorProvider implements vscode.CustomReadonlyEditorProvider<TTFDocument> {
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
  constructor(private readonly _context: vscode.ExtensionContext) {}

  openCustomDocument(
    uri: vscode.Uri,
    openContext: vscode.CustomDocumentOpenContext,
    token: vscode.CancellationToken
  ): TTFDocument | Thenable<TTFDocument> {
    return TTFDocument.create(uri);
  }

  async resolveCustomEditor(
    document: TTFDocument,
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken
  ): Promise<void> {
    webviewPanel.webview.options = {
      enableScripts: true
    };
    let buffer: Uint8Array;
    const glyphs: Glyph[] = [];
    let result: TTF.TTFObject;

    try {
      buffer = this.nodeBufferToArrayBuffer(document.documentData);
      const suffix = document.uri.fsPath.split(".").pop();

      if (suffix == "woff2") {
        await woff2.init(buffer.buffer);
      }

      const font = Font.create(buffer.buffer, {
        type: suffix as any,
        //@ts-ignore
        inflate: suffix == "woff" ? inflate : void 0
      });
      result = font.get();

      for (let i = 0; i < result.glyf.length; i++) {
        const glyph = result.glyf[i];
        if (glyph.unicode) {
          const unencoded = glyph.unicode[glyph.unicode.length - 1].toString(16);
          const unicode = `&#x${unencoded}`;
          const htmlEncoded = `\\u${unencoded};`;

          glyphs.push({
            name: glyph.name,
            unicode,
            unencoded,
            htmlEncoded
          });
        }
      }

      webviewPanel.webview.postMessage({ glyphs });
      webviewPanel.webview.html = this.getWebviewContent(webviewPanel.webview);
    } catch (e) {
      webviewPanel.webview.html = this.getErrorHtmlForWebView(
        webviewPanel.webview,
        e?.message || ""
      );
      console.error(e);
    }
  }

  /**
   * Loads `preview.html` produced by webpack into the web view.
   * @param webview The webview to load the HTML into.
   */
  private getWebviewContent(webview: vscode.Webview) {
    return /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta
              http-equiv="Content-Security-Policy"
              content="img-src ${webview.cspSource} https:;
                    script-src ${webview.cspSource} 'unsafe-inline';"
            />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            <!-- Google Fonts - Quick load from CDN -->
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

            <!-- Google Fonts API -->
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

            <!-- Google Fonts -->
            <link
              href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
              rel="stylesheet"
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;0,1000;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900;1,1000&display=swap"
              rel="stylesheet"
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
              rel="stylesheet"
            />

            <link
              href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap"
              rel="stylesheet"
            />

            <style>
              @font-face {
                font-family: iconfont-preview;
              }

              html,
              body {
                display: flex;
                flex-direction: column;
                flex: 1;
                padding: 0;
              }
            </style>
          </head>
          <script>
            exports = {};
          </script>
          <script src="${webview.asWebviewUri(
            vscode.Uri.file(path.join(this._context.extensionPath, "dist", "preview.js"))
          )}" defer ></script>
          <body></body>
        </html>
`;
  }

  getErrorHtmlForWebView(webview: vscode.Webview, errorMsg: String) {
    return `
    <!DOCTYPE html>
    <html lang="en">

    <head>
      <meta charset="UTF-8">
      <meta http-equiv="Content-Security-Policy" content="font-src 'self' 'unsafe-inline' data:; style-src ${webview.cspSource} 'unsafe-inline'; img-src ${webview.cspSource} https:; script-src  ${webview.cspSource} 'unsafe-inline';">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>

    <body>
      <div style="">
        <div class="content">There are some errors with the plugin <a href="https://marketplace.visualstudio.com/items?itemName=stxr.iconfont-preview">iconfont-preview.</a></div>
        <div class="content">error message:<span style="font-weight:bold;">${errorMsg}</span>. </div>
        <div class="content">please check your font file or open an issue on github,Thank you🙏🙏🙏.</div>
        <div class="content">github: <a href="https://github.com/Stxr/iconfont-preview-extension/issues">https://github.com/Stxr/iconfont-preview-extension</a></div>
      </div>
    `;
  }

  nodeBufferToArrayBuffer(buffer: Uint8Array) {
    var view = new Uint8Array(buffer.length);
    for (var i = 0; i < buffer.length; ++i) {
      view[i] = buffer[i];
    }

    return view;
  }
}

class TTFDocument extends Disposable implements vscode.CustomDocument {
  private constructor(readonly uri: vscode.Uri, private initialContent: Uint8Array) {
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

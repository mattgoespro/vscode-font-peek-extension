import * as vscode from "vscode";
import * as path from "path";
import { Disposable } from "./dispose";
import { Font, TTF, woff2 } from "fonteditor-core";
import { inflate } from "pako";

type Glyph = {
  name: string;
  unicode: string;
  unencoded: string;
  htmlEncoded: string;
};

export class TTFEditorProvider implements vscode.CustomReadonlyEditorProvider<TTFDocument> {
  static register(context: vscode.ExtensionContext): vscode.Disposable {
    return vscode.window.registerCustomEditorProvider(
      "ttf.preview",
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

      const html = this.getHtmlForWebView(
        webviewPanel.webview,
        font.toBase64({ type: "ttf" }, null),
        glyphs
      );
      webviewPanel.webview.postMessage({ glyph: glyphs });
      webviewPanel.webview.html = html;
    } catch (e) {
      webviewPanel.webview.html = this.getErrorHtmlForWebView(
        webviewPanel.webview,
        e?.message || ""
      );
      console.error(e);
    }
  }

  private getStyles(data: string) {
    return /*css*/ `
    @font-face {
      src: url("${data}");
      font-family: iconfont-preview;
    }

    html, body {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: 0;
    }

    #preview {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex: 1;
      flex-wrap: wrap;
      margin: 0;
      background-color: #161616;
    }

    #preview-header {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin: 20px 0;
    }

    #preview-title {
      position: relative;
      font-family: Roboto;
      font-weight: 300;
      text-align: center;
      font-size: 56px;
      margin: 20px 0;
    }

    #preview-subtitle {
      position: relative;
    }

    #preview-subtitle span {
      position: relative;
      font-family: Roboto;
      font-weight: 200;
      text-align: center;
      font-size: 24px;
      margin: 0 0 20px;
    }

    #glyph-search-input {
      position: absolute;
      width: 150px;
      top: calc(50% - 15px);
      right: calc(-50% + 5px);
      font-size: 14px;
      color: white;
      padding: 5px;
      background-color: #0e0e0e;
      border: 1px solid #444444;
      border-radius: 9px;
    }

    #glyph-search-input::placeholder {
      color: #757575;
    }

    #glyphs {
      width: 90%;
      display: flex;
      flex-wrap: wrap;
      flex: 1;
      gap: 10px;
    }

    .glyph {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      flex-basis: 10%;
      border: 1px solid #444444;
      border-radius: 8pt;
      padding: 10px;
    }

    .glyph-name {
      font-family: "Nunito";
      font-size: 12px;
      color: #b3b3b3;
      margin-bottom: 5px;
    }

    .glyph-html {
      color: white;
      font-family: iconfont-preview !important;
      font-size: 30px;
      font-style: normal;
      margin-bottom: 5px;
      -webkit-font-smoothing: antialiased;
      -webkit-text-stroke-width: 0.2px;
    }

    .glyph-codes {
      color: #666666;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      gap: 10px;
      font-size: 10px;
    }

    .glyph-code {
      position: relative;
      color: #4b4b4b;
      color: var(--vscode-editor-foreground);
    }

    .glyph-code:hover::before {
      position: absolute;
      width: 100%;
      height: 50px;
      content: attr(data-code);
      place-content: center;
      background-color: #4b4b4b;
      filter: opacity(60%);
      top: 0;
      left: 0;
      padding: 2px;
      border-radius: 4px;
      font-size: 12px;
      color: red;
    }
    `;
  }

  private createGlyphHtml(glyph: Glyph) {
    return /*html*/ `
    <div class="glyph" title="${glyph.name}">
      <div class="glyph-name">${glyph.name}</div>
      <div class="glyph-html">${glyph.unicode}</div>
      <div class="glyph-codes">
        <span data-code="raw" class="glyph-code">${glyph.unencoded}</span>
        <span data-code="unicode" class="glyph-code">${glyph.htmlEncoded}</span>
      </div>
    </div>
    `;
  }

  getHtmlForWebView(webview: vscode.Webview, data: string, glyph: Glyph[]) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.file(path.join(this._context.extensionPath, "media", "load-ttf.js"))
    );

    return /*html*/ `
    <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="Content-Security-Policy" content="font-src 'self' 'unsafe-inline' data:; style-src ${
            webview.cspSource
          } 'unsafe-inline'; img-src ${webview.cspSource} https:;
          script-src ${webview.cspSource} 'unsafe-inline';">
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

          <title>icontfont-preview</title>

          <script src="${scriptUri}" type="text/javascript"></script>

          <style>
            ${this.getStyles(data)}
          </style>
        </head>

        <body>
          <div id="preview">
            <div id="preview-header">
              <h1 id="preview-title">Iconfonts Preview</h1>
              <h2 id="preview-subtitle">
                <span>Click on the icon to copy the unicode</span>
                <input id="glyph-search-input" name="glyph-search-input" type="search" placeholder="Search for icon" />
              </h2>
            </div>
            <div id="glyphs">
              ${glyph.map(this.createGlyphHtml.bind(this)).join("\n")}
            </div>
          </div>
        </body>
      </html>`;
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
    // console.log('raw buffer:', buffer)
    // console.log('final buffer:',view.buffer)
    return view;
  }
}
class TTFDocument extends Disposable implements vscode.CustomDocument {
  private static async readFile(uri: vscode.Uri): Promise<Uint8Array> {
    if (uri.scheme === "untitled") {
      return new Uint8Array();
    }
    return vscode.workspace.fs.readFile(uri);
  }
  static async create(uri: vscode.Uri) {
    const fileData = await TTFDocument.readFile(uri);
    console.log(uri, fileData);
    return new TTFDocument(uri, fileData);
  }

  private readonly _uri: vscode.Uri;
  private _documentData: Uint8Array;
  // private readonly _delegate: TTFDocumentDelegate;
  private constructor(uri: vscode.Uri, initialContent: Uint8Array) {
    super();
    this._uri = uri;
    this._documentData = initialContent;
  }

  public get uri() {
    return this._uri;
  }
  public get documentData(): Uint8Array {
    return this._documentData;
  }
}
interface TTFDocumentDelegate {
  getFileData(): Promise<Uint8Array>;
}

function getNonce() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

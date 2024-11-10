import vscode from "vscode";

export class FontDocument implements vscode.CustomDocument {
  private static disposables: vscode.Disposable[] = [];
  private contents: Buffer;

  constructor(public readonly uri: vscode.Uri) {}

  protected async readFile(uri: vscode.Uri) {
    if (uri.scheme === "untitled") {
      this.contents = Buffer.from([]);
    }

    const fontData = await vscode.workspace.fs.readFile(uri);
    this.contents = Buffer.from(fontData);
  }

  static async create(uri: vscode.Uri) {
    const document = new FontDocument(uri);
    await document.readFile(uri);
    this.disposables.push(document);

    return document;
  }

  static dispose() {
    this.disposables.forEach((disposable) => disposable.dispose());
  }

  public getFontData() {
    return this.contents;
  }

  public getFontDataBase64() {
    return this.contents.toString("base64");
  }

  public getFontDataWebviewUri() {
    return `data:font/ttf;base64,${this.getFontDataBase64()}`;
  }

  public dispose(): void {
    // no-op
  }
}

import vscode from "vscode";

export class FontDocument implements vscode.CustomDocument {
  private static disposables: vscode.Disposable[] = [];
  private contents: Buffer;
  constructor(public readonly uri: vscode.Uri) {}

  protected async readFile(uri: vscode.Uri): Promise<Buffer> {
    if (uri.scheme === "untitled") {
      return Buffer.from([]);
    }

    this.contents = Buffer.from(await vscode.workspace.fs.readFile(uri));
  }

  static async create(uri: vscode.Uri) {
    const document = new FontDocument(uri);
    await document.readFile(uri);
    this.disposables.push(document);

    return document;
  }

  static dispose() {
    this.disposables.forEach((disposable) => disposable.dispose());
    this.disposables = [];
  }

  public getFontData() {
    return Buffer.from(this.contents.buffer);
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

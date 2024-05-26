import vscode from "vscode";

export class FontDocument implements vscode.CustomDocument {
  constructor(public readonly uri: vscode.Uri, private contents: Buffer) {}

  dispose(): void {}

  private static async readFile(uri: vscode.Uri): Promise<Buffer> {
    if (uri.scheme === "untitled") {
      return Buffer.from([]);
    }

    return Buffer.from(await vscode.workspace.fs.readFile(uri));
  }

  static async create(uri: vscode.Uri) {
    const fileData = await FontDocument.readFile(uri);
    return new FontDocument(uri, fileData);
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
}

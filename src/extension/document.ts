import vscode from "vscode";

export class TTFDocument implements vscode.CustomDocument {
  constructor(public readonly uri: vscode.Uri, private initialContent: Uint8Array) {}
  dispose(): void {
    throw new Error("Method not implemented.");
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

import vscode from "vscode";
import { EditorFontDocument } from "./editor-font-document";
import { createLogger, Logger } from "../shared/logging";

export class EditorFontDocumentProvider
  implements vscode.CustomReadonlyEditorProvider<EditorFontDocument>
{
  private document: EditorFontDocument;
  private log: Logger;

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly outputChannel: vscode.OutputChannel
  ) {
    this.log = createLogger("EditorFontDocumentProvider", this.outputChannel.appendLine);
  }

  /**
   * Registers the font preview custom editor provider.
   * @param context The extension context.
   */
  static register(
    context: vscode.ExtensionContext,
    outputChannel: vscode.OutputChannel
  ): vscode.Disposable {
    return vscode.window.registerCustomEditorProvider(
      "fontGlyphPreview.editor.preview",
      new EditorFontDocumentProvider(context, outputChannel),
      {
        supportsMultipleEditorsPerDocument: true,
        webviewOptions: {
          retainContextWhenHidden: true
        }
      }
    );
  }

  async openCustomDocument(
    uri: vscode.Uri,
    _: vscode.CustomDocumentOpenContext,
    token: vscode.CancellationToken
  ): Promise<EditorFontDocument> {
    token.onCancellationRequested(() => {
      this.dispose();
      vscode.window.showInformationMessage("Cancelled preview.");
    }, this.context.subscriptions);

    return new EditorFontDocument(this.context, uri, this.outputChannel);
  }

  async resolveCustomEditor(
    document: EditorFontDocument,
    webviewPanel: vscode.WebviewPanel
  ): Promise<void> {
    try {
      await document.createWebview(webviewPanel);
    } catch (error) {
      this.log.error(`Failed to resolve custom editor: ${error.message}`);
      this.log.error(error.stack);

      vscode.window.showErrorMessage("Failed to open font preview editor.");

      this.dispose();
    }
  }

  /**
   * Disposes of the font preview document.
   */
  dispose() {
    this.document.dispose();
  }
}

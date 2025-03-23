import vscode from "vscode";
import { FontDocument } from "./document";

export class FontPreviewDocumentProvider
  implements vscode.CustomReadonlyEditorProvider<FontDocument>
{
  private document: FontDocument;

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly outputChannel: vscode.OutputChannel
  ) {}

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
      new FontPreviewDocumentProvider(context, outputChannel),
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
  ): Promise<FontDocument> {
    this.document = await FontDocument.create(this.context, uri, this.outputChannel);

    token.onCancellationRequested(() => {
      this.dispose();
      vscode.window.showInformationMessage("Cancelled preview.");
    });

    return this.document;
  }

  async resolveCustomEditor(
    document: FontDocument,
    webviewPanel: vscode.WebviewPanel
  ): Promise<void> {
    try {
      await document.initWebview(webviewPanel);
    } catch (error) {
      this.dispose();
      this.outputChannel.appendLine(`Failed to resolve custom editor: ${error.message}`);
      this.outputChannel.appendLine(error.stack);
      this.outputChannel.show();
      vscode.window.showErrorMessage("Failed to open font preview editor.");
    }
  }

  /**
   * Disposes of the font preview document provider.
   */
  dispose() {
    this.document.dispose();
  }
}

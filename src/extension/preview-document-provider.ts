import vscode from "vscode";
import { PreviewDocument } from "./preview-document";

export class PreviewDocumentProvider
  implements vscode.CustomReadonlyEditorProvider<PreviewDocument>
{
  private document: PreviewDocument;

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
      new PreviewDocumentProvider(context, outputChannel),
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
  ): Promise<PreviewDocument> {
    this.document = await PreviewDocument.create(this.context, uri, this.outputChannel);

    token.onCancellationRequested(() => {
      this.dispose();
      vscode.window.showInformationMessage("Cancelled preview.");
    });

    return this.document;
  }

  async resolveCustomEditor(
    document: PreviewDocument,
    webviewPanel: vscode.WebviewPanel
  ): Promise<void> {
    try {
      await document.createWebview(webviewPanel);
    } catch (error) {
      this.dispose();
      vscode.window.showErrorMessage("Failed to create custom editor.", error);
    }
  }

  /**
   * Disposes of the font preview document provider.
   */
  dispose() {
    this.document.dispose();
  }
}

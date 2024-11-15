import vscode from "vscode";
import { FontDocument } from "./document";

export class FontPreviewDocumentProvider
  implements vscode.CustomReadonlyEditorProvider<FontDocument>
{
  private document: FontDocument;

  private outputChannel = vscode.window.createOutputChannel("Font Preview Document");

  constructor(private readonly context: vscode.ExtensionContext) {}

  /**
   * Registers the font preview custom editor provider.
   * @param context The extension context.
   */
  static register(context: vscode.ExtensionContext): vscode.Disposable {
    return vscode.window.registerCustomEditorProvider(
      "fontGlyphPreview.editor.preview",
      new FontPreviewDocumentProvider(context),
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

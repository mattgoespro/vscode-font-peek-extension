import vscode from "vscode";
import { createLogger, Logger } from "../shared/logging";
import { EditorFontDocument } from "./editor-font-document";

export class EditorFontDocumentProvider
  implements vscode.CustomReadonlyEditorProvider<EditorFontDocument>
{
  private output: Logger;

  constructor(
    private readonly context: vscode.ExtensionContext,
    readonly outputChannel: vscode.OutputChannel
  ) {
    this.output = createLogger("EditorFontDocumentProvider", {
      printer: this.outputChannel.appendLine
    });
  }

  /**
   * Registers the font preview custom editor provider.
   *
   * @param context The extension context.
   * @param outputChannel The output channel for logging.
   *
   * @returns A disposable to unregister the provider.
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
      vscode.window.showInformationMessage("Cancelled preview.");
    }, this.context.subscriptions);

    return new EditorFontDocument(this.context, uri, this.outputChannel);
  }

  async resolveCustomEditor(
    document: EditorFontDocument,
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken
  ): Promise<void> {
    token.onCancellationRequested(() => {
      webviewPanel.dispose();
      vscode.window.showInformationMessage("Cancelled preview.");
    }, this.context.subscriptions);

    try {
      await document.loadPanelWebview(webviewPanel);
    } catch (error) {
      this.output.error(`Failed to resolve custom editor: ${error.message}`);
      this.output.error(error.stack);

      vscode.window.showErrorMessage("Failed to open font preview editor.");
    }
  }
}

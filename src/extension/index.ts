import vscode from "vscode";
import { EditorFontDocumentProvider } from "./app/editor-font-document-provider";
import { createLogger } from "logsculpt";

export function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel("Font Glyph Preview");
  outputChannel.show();

  const logger = createLogger("FontPeek", { printer: outputChannel.appendLine });

  context.subscriptions.push(EditorFontDocumentProvider.register(context, outputChannel));
  logger.info("Font Glyph Preview activated.");
}

export function deactivate() {}

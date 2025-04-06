import vscode from "vscode";
import { EditorFontDocumentProvider } from "./extension/editor-font-document-provider";
import { createLogger } from "./shared/logging/logger";

export function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel("Font Glyph Preview");
  outputChannel.show();

  const logger = createLogger("FontPeek");

  context.subscriptions.push(EditorFontDocumentProvider.register(context, outputChannel));
  outputChannel.appendLine(logger.createLogMessage("Font Glyph Preview activated.", true));
}

export function deactivate() {}

import vscode from "vscode";
import { FontPreviewDocumentProvider } from "./extension/editor";
import { createLogger } from "./shared/logging/logger";

export function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel("Font Glyph Preview");
  const logger = createLogger("Font Glyph Preview");

  context.subscriptions.push(FontPreviewDocumentProvider.register(context, outputChannel));
  outputChannel.appendLine(logger.createLogMessage("Font Glyph Preview activated.", true));
}

export function deactivate() {}

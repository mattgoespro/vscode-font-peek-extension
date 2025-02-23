import vscode from "vscode";
import { FontPreviewDocumentProvider } from "./extension/editor";
import { createLogger } from "./shared/logging/logger";

export function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel("FontPeek");
  const logger = createLogger("FontPeek");

  context.subscriptions.push(FontPreviewDocumentProvider.register(context, outputChannel));
  outputChannel.appendLine(logger.createLogMessage("FontPeek activated.", true));
}

export function deactivate() {}

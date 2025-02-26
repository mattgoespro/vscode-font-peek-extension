import vscode from "vscode";
import { PreviewDocumentProvider } from "./extension/preview-document-provider";
import { createLogger } from "./shared/logging/logger";

export function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel("FontPeek");
  const logger = createLogger("FontPeek");

  context.subscriptions.push(PreviewDocumentProvider.register(context, outputChannel));
  outputChannel.appendLine(logger.createLogMessage("FontPeek activated.", true));
}

export function deactivate() {}

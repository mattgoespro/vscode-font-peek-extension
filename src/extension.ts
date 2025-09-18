import vscode from "vscode";
import { EditorFontDocumentProvider } from "./extension/editor-font-document-provider";
import { createLogger } from "@shared/logging";

export function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel("Font Glyph Preview");
  outputChannel.show();

  const logger = createLogger("FontPeek", { printer: outputChannel.appendLine });

  context.subscriptions.push(EditorFontDocumentProvider.register(context, outputChannel));
  logger.info("Extension activated.");
}

export function deactivate() {}

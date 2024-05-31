import vscode from "vscode";
import { output } from "@/shared/output";
import { FontPreviewDocumentProvider } from "./extension/editor";

export function activate(context: vscode.ExtensionContext) {
  const outputChannel = vscode.window.createOutputChannel("Font Glyph Preview");

  context.subscriptions.push(FontPreviewDocumentProvider.register(context, outputChannel));
  output(outputChannel, "extension", "Extension", "Started Font Glyph Preview.");
}

export function deactivate() {}

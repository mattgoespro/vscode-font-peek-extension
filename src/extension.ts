import vscode from "vscode";
import { FontPreviewDocumentProvider } from "./extension/editor";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(FontPreviewDocumentProvider.register(context));
}

export function deactivate() {}

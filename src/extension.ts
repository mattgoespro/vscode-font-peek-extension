import vscode from "vscode";
import { FontPreviewWebviewProvider } from "./extension/editor";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(FontPreviewWebviewProvider.register(context));
}

export function deactivate() {}

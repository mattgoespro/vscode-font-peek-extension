import * as vscode from "vscode";
import { TTFEditorProvider } from "./extension/editor";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(TTFEditorProvider.register(context));
}

export function deactivate() {}

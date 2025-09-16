import { EditorMessage } from "@shared/message/message.model";
import vscode from "vscode";

declare module "vscode" {
  interface Webview extends vscode.Webview {
    postMessage<T extends EditorMessage>(message: T): Thenable<boolean>;
  }

  interface WebviewPanel extends vscode.WebviewPanel {
    webview: Webview;
  }

  export interface VsCodeApi {
    postMessage<T extends EditorMessage>(message: T): void;
  }
}

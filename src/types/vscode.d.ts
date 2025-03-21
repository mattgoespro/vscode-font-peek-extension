import { EditorMessage } from "../shared/events/messages";

declare module "vscode" {
  interface Webview {
    postMessage<T extends EditorMessage>(message: T): Thenable<boolean>;
  }
}

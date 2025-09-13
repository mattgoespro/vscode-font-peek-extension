import { EditorMessage } from "./message.model";

export type WebviewStateChangedEvent = EditorMessage<"webview", "webview-state-changed">;
export type WebviewLogOutputEvent = EditorMessage<"webview", "log-output">;
export type LoadFontEvent = EditorMessage<"extension", "load-font">;

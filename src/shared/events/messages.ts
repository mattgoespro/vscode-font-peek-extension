import { FontGlyph } from "../model";

export type LogLevel = "info" | "warn" | "error";

export type MessageContext = "webview" | "extension";

type MessagePayloads = {
  webview: {
    "webview-state-changed": {
      state: "ready";
    };
    "log-output": {
      moduleContext: string;
      level: LogLevel;
      args: unknown[];
    };
    notify: {
      moduleContext: string;
      level: LogLevel;
      message: string;
    };
  };
  extension: {
    "font-glyphs-loaded": {
      glyphs: FontGlyph[];
    };
  };
};

export type EditorMessage<T extends keyof MessagePayloads> = {
  [K in keyof MessagePayloads[T]]: {
    source: T;
    name: K;
  } & MessagePayloads[T][K];
}[keyof MessagePayloads[T]];

import { FontSpec } from "../model";

export type LogLevel = "info" | "warn" | "error";

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
  };
  extension: {
    "font-glyphs-loaded": {
      fontData: FontSpec;
    };
  };
};

export type EditorMessage<T extends keyof MessagePayloads> = {
  [K in keyof MessagePayloads[T]]: {
    source: T;
    name: K;
  } & { payload: MessagePayloads[T][K] };
}[keyof MessagePayloads[T]];

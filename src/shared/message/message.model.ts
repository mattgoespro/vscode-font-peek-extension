import { LogLevel } from "@shared/logging";

type MessagePayloads = {
  webview: {
    "webview-state-changed": {
      state: "opened" | "ready" | "closed";
    };
    "log-output": {
      level: LogLevel;
      args: unknown[];
    };
  };
  extension: {
    "load-font": {
      fileUri: string;
    };
  };
};

export type EditorMessage<
  Sender extends keyof MessagePayloads,
  Name extends keyof MessagePayloads[Sender]
> = {
  name: Name;
  payload: MessagePayloads[Sender][Name] extends undefined
    ? undefined
    : MessagePayloads[Sender][Name];
};

import { EditorMessage, LogLevel } from "../../shared/events/messages";

export const useOutputPanel = (context: string, vscodeApi: VsCodeApi) => {
  const logMessage = (level: LogLevel) => {
    return (...args: unknown[]) => {
      vscodeApi.postMessage<EditorMessage<"webview">>({
        data: { source: "webview", name: "log-output", level, moduleContext: context, args }
      });
    };
  };

  return {
    info: logMessage("info"),
    warn: logMessage("warn"),
    error: logMessage("error")
  };
};

export const useNotifications = (context: string, vscodeApi: VsCodeApi) => {
  const notify = (level: LogLevel, message: string) => {
    vscodeApi.postMessage<EditorMessage<"webview">>({
      data: { source: "webview", name: "notify", level, moduleContext: context, message }
    });
  };

  return { notify };
};

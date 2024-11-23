import { EditorMessage, LogLevel } from "../../../shared/events/messages";

export const useOutputPanel = (moduleContext: string, vscodeApi: VsCodeApi) => {
  const logMessage = (level: LogLevel) => {
    return (...args: unknown[]) => {
      vscodeApi.postMessage<EditorMessage<"webview">>({
        data: { source: "webview", name: "log-output", level, moduleContext, args }
      });
    };
  };

  return {
    info: logMessage("info"),
    warn: logMessage("warn"),
    error: logMessage("error")
  };
};

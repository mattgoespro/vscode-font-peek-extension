import { LogLevel } from "logsculpt";
import { VsCodeApiContext } from "../contexts/vscode-api-context";
import { useContext } from "react";
import { WebviewLogOutputEvent } from "@shared/message/messages";

export function useOutputPanel() {
  const vscodeApi = useContext(VsCodeApiContext);
  const logMessage = (level: LogLevel) => {
    return (...args: unknown[]) => {
      vscodeApi.postMessage<WebviewLogOutputEvent>({
        name: "log-output",
        payload: {
          level,
          args
        }
      });
    };
  };

  return {
    info: logMessage("info"),
    warn: logMessage("warn"),
    error: logMessage("error")
  };
}

import { LogLevel } from "@shared/logging";
import { VsCodeContext } from "../contexts/vscode-api-context";
import { useContext } from "react";
import { WebviewLogOutputEvent } from "@shared/message/messages";

export const useOutputPanel = () => {
  const vscodeApi = useContext(VsCodeContext);
  const logMessage = (level: LogLevel) => {
    return (...args: unknown[]) => {
      vscodeApi.postMessage(
        JSON.stringify(<WebviewLogOutputEvent>{
          sender: "webview",
          name: "log-output",
          payload: {
            level,
            args
          }
        })
      );
    };
  };

  return {
    info: logMessage("info"),
    warn: logMessage("warn"),
    error: logMessage("error")
  };
};

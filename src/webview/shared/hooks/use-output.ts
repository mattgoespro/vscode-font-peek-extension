import { useContext } from "react";
import { LogMessage } from "../../../shared/events/messages";
import { ExtensionWebviewContext } from "../extension-webview-context";

export const useOutput = (moduleContext: string) => {
  const vsCodeContext = useContext(ExtensionWebviewContext);

  return [
    (...args: unknown[]) => {
      vsCodeContext.vscodeApi.postMessage<LogMessage>({
        data: { type: "log", moduleContext, args }
      });
    }
  ];
};

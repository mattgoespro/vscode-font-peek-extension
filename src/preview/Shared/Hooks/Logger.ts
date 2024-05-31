import { useContext } from "react";
import { LogMessage } from "../../../shared/events/messages";
import { ExtensionWebviewContext } from "../ExtensionWebviewContext";
import * as logContexts from "./LogContexts";

export const useOutput = (moduleContext: keyof typeof logContexts) => {
  const vsCodeContext = useContext(ExtensionWebviewContext);

  return [
    (...args: unknown[]) => {
      vsCodeContext.vscodeApi.postMessage<LogMessage>({
        data: { type: "log", moduleContext, args }
      });
    }
  ];
};

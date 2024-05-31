import { createContext } from "react";

export type ExtensionWebviewContextState = {
  vscodeApi: VsCodeApi;
};

export const ExtensionWebviewContext = createContext<ExtensionWebviewContextState>(undefined);

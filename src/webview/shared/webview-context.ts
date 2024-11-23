import { createContext } from "react";

export type WebviewContextState = {
  vscodeApi: VsCodeApi;
};

export const WebviewContext = createContext<WebviewContextState>({
  vscodeApi: null
});

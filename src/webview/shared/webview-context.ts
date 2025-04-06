import { createContext } from "react";
import { FontData } from "../../shared/model";

export type FontContext = {
  font: FontData;
  vscodeApi: VsCodeApi;
};

export const WebviewContext = createContext<FontContext>({
  vscodeApi: null,
  font: null
});

import { createContext } from "react";
import { FontSpec } from "../../shared/model";

export type FontContext = {
  fontSpec: FontSpec;
  vscodeApi: VsCodeApi;
};

export const WebviewContext = createContext<FontContext>({
  vscodeApi: null,
  fontSpec: null
});

import { FontSpec } from "@shared/model";
import { createContext } from "react";

export type FontContextProps = {
  fontSpec: FontSpec;
};

export const FontContext = createContext<FontContextProps>({
  fontSpec: null
});

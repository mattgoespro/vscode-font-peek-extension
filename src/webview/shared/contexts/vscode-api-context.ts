import { Context, createContext } from "react";
import { VsCodeApi } from "vscode";

export const VsCodeApiContext: Context<VsCodeApi> = createContext(window.acquireVsCodeApi());

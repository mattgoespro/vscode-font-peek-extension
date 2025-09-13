import { Context, createContext } from "react";
import { WebviewApi } from "vscode";

export const VsCodeContext: Context<WebviewApi> = createContext(window.acquireVsCodeApi());

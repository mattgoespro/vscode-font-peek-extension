import { OutputChannel } from "vscode";

export type OutputContext = "extension" | "webview";

export function output(
  channel: OutputChannel,
  context: OutputContext,
  logContext: string,
  ...args: unknown[]
) {
  channel.appendLine(`[ ${new Date().toLocaleDateString()}, ${context}:${logContext}] ${args}`);
}

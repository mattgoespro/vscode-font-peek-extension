import { OutputChannel } from "vscode";

export type OutputContext = "extension" | "webview";

export function output(
  channel: OutputChannel,
  context: OutputContext,
  module: string,
  ...args: unknown[]
) {
  if (args.length === 0) {
    throw new Error("No arguments provided to output function.");
  }

  const getOutputLines = (arg: unknown, prefix: string): string[] => {
    let output: string[] = [];

    switch (true) {
      case Array.isArray(arg):
        arg.forEach((item) => {
          output = output.concat(`${getOutputLines(item, prefix)},\n`);
        });
        break;
      case typeof arg === "object":
        output.push(`${prefix}{`);

        for (const [key, value] of Object.entries(arg)) {
          output.push(`${prefix}${key}: ${value}`);
        }

        output.push(`${prefix}}`);
        break;
      default:
        output.push(`${prefix}${arg}`);
        break;
    }

    return output;
  };
  channel.show();

  getOutputLines(args, "").forEach((line) => {
    channel.appendLine(`[${new Date().toUTCString()}] ${line} [${context}.${module}]`);
  });
  // channel.appendLine(
  //   `[${new Date().toUTCString()}] ${args.map(printOutput).join("")} [${context}.${module}]`
  // );
}

// export function output(
//   channel: OutputChannel,
//   context: OutputContext,
//   logContext: string,
//   ...args: OutputMessageArgument[]
// ) {
//   const getObjectString = (
//     channel: OutputChannel,
//     context: OutputContext,
//     logContext: string,
//     obj: OutputMessageArgument
//   ) => {
//     let str = "";
//     for (const [key, value] of Object.entries(obj)) {
//       str += `\t${key}: ${
//         typeof value === "object" ? getObjectString(channel, context, logContext, value) : value
//       }, `;
//     }
//     return str;
//   };

//   let outputMsg = "";

//   for (const arg of args) {
//     switch (true) {
//       case typeof arg === "object":
//         outputMsg += `[ ${new Date().toLocaleDateString()}, ${context}:${logContext}] Object:${getObjectString(
//           channel,
//           context,
//           logContext,
//           arg
//         )}\n\n`;
//         break;
//       case Array.isArray(arg):
//         outputMsg += `:\n`;
//         outputMsg += `${getObjectString(channel, context, logContext, arg)}\n`;
//         break;
//       default:
//         outputMsg += arg;
//         break;
//     }
//   }

//   channel.appendLine(outputMsg);
// }

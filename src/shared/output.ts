import { window } from "vscode";

type OutputMessage = string | number | boolean | object;

type OutputEmitter = {
  log: (thisArg: ThisParameterType<OutputEmitter>, ...message: OutputMessage[]) => void;
};

const output = window.createOutputChannel("Font Glyph Preview");

const outputLogger: OutputEmitter = {
  log: (...args: OutputMessage[]) => {
    const timestamp = new Date().toLocaleTimeString();
    let subMessage = `${timestamp}: `;

    for (const arg of args) {
      switch (true) {
        case typeof arg === "string":
        case typeof arg === "number":
        case typeof arg === "boolean":
          subMessage += arg;
          break;
        case Array.isArray(arg):
          for (let i = 0; i < arg.length; i++) {
            output.appendLine(arg[i] + (i < arg.length - 1 ? "," : ""));
          }
          break;
        case typeof arg === "object":
          output.appendLine(`${subMessage}:`);
          subMessage = "";

          for (const key in arg) {
            subMessage += `  ${key}: ${arg[key]}\n`;
          }

          output.appendLine(subMessage);
          subMessage = `${timestamp}:`;
          break;
      }
    }
  }
};

export function withLogger(output: (emit: OutputEmitter) => void) {
  console.log("withOutput called");
  output(outputLogger);
}

export const logger = {
  log: (...args: OutputMessage[]) => {
    output; //Logger.log(args);
  }
};

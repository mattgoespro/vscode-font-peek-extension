import { prettyStringify } from "./text-formatting";

export type Logger = {
  info: (...messageArgs: LogMessage[]) => void;
  warn: (...messageArgs: LogMessage[]) => void;
  error: (...messageArgs: LogMessage[]) => void;
  singleError: (error: Error) => void;
  createLogMessage: (message: LogMessage, addPrefix?: boolean) => string;
};

type LogMessage = unknown;

/**
 * Returns a function that logs messages of different levels prefixed with the logger name.
 *
 * @param name the log message prefix
 */
export function createLogger(name: string): Logger {
  const createLogMessage = (message: LogMessage, addPrefix = false) => {
    return `${addPrefix ? `[${name}]: ` : ""}${prettyStringify(message, { sortObjectKeys: true, quoteStrings: false })}`;
  };

  const formatLogLevel = (level: "info" | "warn" | "error") => {
    return level;
  };

  const logger: Logger = {
    info: (...messageArgs: LogMessage[]) =>
      console.log(
        `${formatLogLevel("info")}: ${messageArgs.map((arg) => createLogMessage(arg)).join(" ")}`
      ),
    warn: (...messageArgs: LogMessage[]) =>
      console.warn(
        `${formatLogLevel("warn")}: ${messageArgs.map((arg) => createLogMessage(arg)).join(" ")}`
      ),
    error: (...messageArgs: LogMessage[]) =>
      console.error(
        `${formatLogLevel("error")}: ${messageArgs.map((arg) => createLogMessage(arg)).join(" ")}`
      ),
    singleError: (error: Error) => console.error(`${formatLogLevel("error")}: ${error.message}`),
    createLogMessage
  };

  return logger;
}

import { prettyStringify } from "./text-formatting";

export type Logger = {
  info: (...messageArgs: LogMessage[]) => void;
  warn: (...messageArgs: LogMessage[]) => void;
  error: (...messageArgs: LogMessage[]) => void;
  debug: (...messageArgs: LogMessage[]) => void;
  startTimer: () => void;
  endTimer: () => string;
  singleError: (error: Error) => void;
  createLogMessage: (message: LogMessage, addPrefix?: boolean) => string;
};

type LogMessage = unknown;
type LogWriter =
  | ((...args: string[]) => void)
  | {
      log: (...args: string[]) => void;
      info: (...args: string[]) => void;
      warn: (...args: string[]) => void;
      error: (...args: string[]) => void;
      debug: (...args: string[]) => void;
    };

/**
 * Returns a function that logs messages of different levels prefixed with the logger name.
 *
 * @param name the log message prefix
 */
export function createLogger(name: string, writer: LogWriter = console): Logger {
  const createLogMessage = (message: LogMessage, addPrefix = false) => {
    return `${addPrefix ? `[${name}]: ` : ""}${prettyStringify(message, { sortObjectKeys: true, quoteStrings: false })}`;
  };

  const formatLogLevel = (level: "info" | "warn" | "error" | "debug") => {
    return level;
  };

  const log =
    typeof writer === "function" ? { log: writer, info: writer, warn: writer, error: writer, debug: writer } : writer;

  let performanceTime: number;

  const logger: Logger = {
    info: (...messageArgs: LogMessage[]) =>
      log.info(`${formatLogLevel("info")}: ${messageArgs.map((arg) => createLogMessage(arg)).join(" ")}`),
    warn: (...messageArgs: LogMessage[]) =>
      log.warn(`${formatLogLevel("warn")}: ${messageArgs.map((arg) => createLogMessage(arg)).join(" ")}`),
    error: (...messageArgs: LogMessage[]) =>
      log.error(`${formatLogLevel("error")}: ${messageArgs.map((arg) => createLogMessage(arg)).join(" ")}`),
    debug: (...messageArgs: LogMessage[]) =>
      log.debug(`${formatLogLevel("debug")}: ${messageArgs.map((arg) => createLogMessage(arg)).join(" ")}`),
    startTimer: () => (performanceTime = performance.now()),
    endTimer: () => {
      const time = performance.now() - performanceTime;
      return time.toFixed(2);
    },
    singleError: (error: Error) => log.error(`${formatLogLevel("error")}: ${error.message}`),
    createLogMessage,
  };

  return logger;
}

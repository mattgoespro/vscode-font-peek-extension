export type LogLevel = "info" | "warn" | "error";

export type LogMessage = unknown;

export type LogWriter =
  | ((...args: string[]) => void)
  | {
      log: (...args: string[]) => void;
      info: (...args: string[]) => void;
      warn: (...args: string[]) => void;
      error: (...args: string[]) => void;
      debug: (...args: string[]) => void;
    };

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

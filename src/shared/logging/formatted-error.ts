export abstract class FormattedError<
  O extends Record<string, unknown> = Record<string, unknown>
> extends Error {
  constructor(
    message: string,
    cause: Error = null,
    private options: O = null
  ) {
    super(message);
    this.name = "FormattedError";
    this.message = this._formatMessage();
    this.cause = cause;
  }

  static isFormattedError(error: unknown): error is FormattedError {
    return error instanceof FormattedError;
  }

  protected abstract getFormattedMessage(message: string, cause: Error, options: O): string;

  private _formatMessage(): string {
    const message = this.getFormattedMessage(this.message, this.cause as Error, this.options);

    if (this.cause == null) {
      // return "";
      return `${this.name}: ${message}`;
    }

    // Log the cause within the main error box
    const reason = `Reason: ${FormattedError.isFormattedError(this.cause) ? this.cause.message : this.cause.toString()}`;
    return `${message}\n\n\t${reason}`;
    // return "";
  }
}

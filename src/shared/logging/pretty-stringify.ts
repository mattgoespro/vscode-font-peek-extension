/**
 * Options for formatting JSON objects.
 *
 * @property prefix - Whether to include a prefix for each line of the formatted string.
 * @property indent - The initial indentation level for the formatted string.
 * @property objectKeyModifier - A function that modifies object keys before formatting.
 * @property objectValueModifier - A function that modifies object values before formatting.
 * @property sortObjectKeys - Whether to sort object keys before formatting.
 * @property quoteStrings - Whether to quote string values in the formatted string.
 */
export type PrettyStringifyOptions = {
  prefix?: boolean | PrettyStringifyPrefixFn;
  indent?: number;
  objectKeyModifier?: (key: string) => string;
  objectValueModifier?: (value: unknown) => string;
  sortObjectKeys?: boolean;
  quoteStrings?: boolean;
};

type PrettyStringifyPrefixFn = (name: string) => string;

/**
 * Converts a given value to a pretty-printed string representation.
 *
 * @param value - The value to be pretty-printed. Can be of any type.
 * @param options - Optional formatting options for JSON strings.
 * @param indent - The initial indentation level for the formatted string. Defaults to 0.
 * @returns The pretty-printed string representation of the value.
 * @throws Will throw an error if the value type is unsupported.
 */
export function prettyStringify(value: unknown, options?: PrettyStringifyOptions): string {
  const initialIndent = options?.indent ?? 0;

  switch (typeof value) {
    case "string":
      return options?.quoteStrings ? `"${value}"` : value;
    case "boolean":
    case "number":
      return value.toString();
    case "undefined":
      return "undefined";
    case "function":
      return value.toString();
    case "object":
      if (value === null) {
        return "null";
      }

      if (Array.isArray(value)) {
        if (value.length === 0) {
          return "[]";
        }

        return stringifyArray(value, options, initialIndent);
      }

      if (Object.keys(value).length === 0) {
        return "{}";
      }

      return stringifyObject(value as Record<string, unknown>, options, initialIndent);
    default:
      throw new Error(`Unsupported object type: ${typeof value}`);
  }
}

/**
 * Formats an array of objects into a pretty-printed JSON string with the specified indentation.
 *
 * @param array - The array of objects to format.
 * @param options - Optional formatting options.
 * @param indent - Indentation level.
 * @returns The formatted array as a JSON string.
 */
function stringifyArray(array: object[], options: PrettyStringifyOptions, indent: number): string {
  const formattedArray = array
    .map(
      (value) =>
        `${" ".repeat(indent + 2)}${prettyStringify(value, { ...options, indent: indent + 2 })}`
    )
    .join(`,\n`);
  return `[\n${formattedArray}\n${" ".repeat(indent)}]`;
}

/**
 * Formats a given object into a pretty-printed string representation.
 *
 * @param object - The object to format.
 * @param options - Optional formatting options.
 * @param indent - The number of spaces to use for indentation (default is 0).
 * @returns The formatted string representation of the object.
 */
function stringifyObject(
  object: Record<string, unknown>,
  options?: PrettyStringifyOptions,
  indent = 0
): string {
  const keyModifier = options?.objectKeyModifier ?? ((key) => key);
  const valueModifier = options?.objectValueModifier ?? ((value) => `${value}`);

  const formattedObject = (
    options?.sortObjectKeys
      ? Object.entries(object).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      : Object.entries(object)
  )
    .map(([key, value]) => {
      if (
        value == null ||
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        const quotedValue = options?.quoteStrings ? `"${value}"` : value;
        return `${" ".repeat(indent + 2)}${keyModifier(key)}: ${valueModifier(quotedValue)}`;
      }

      return `${" ".repeat(indent + 2)}${keyModifier(key)}: ${prettyStringify(value, {
        ...options,
        indent: indent + 2
      })}`;
    })
    .join(`,\n`);
  return `{\n${formattedObject}\n${" ".repeat(indent)}}`;
}

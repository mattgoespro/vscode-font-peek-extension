export const Colors = {
  orange: "#FFA500",
  gold: "#FFD700",
  darkGrey: "#1f1f1f",
  blackGrey: "#181818"
};

type FormatJsonOptions = {
  objectKeyModifier?: (key: string) => string;
  objectValueModifier?: (value: unknown) => string;
  sortObjectKeys?: boolean;
  quoteStrings?: boolean;
};

/**
 * Accepts a JavaScript object and formats the value into a prettified string with the following rules:
 * - Appearance of the value is based on the type of the value:
 *   > If the value is a string, it is enclosed in double quotes
 *   > If the value is a boolean, number, null, or undefined, it is displayed as-is
 *   > If the value is a function, it is serialized as a string
 *   > If the value is an array:
 *    - The array is enclosed in square brackets
 *    - List items are separated by a new line
 *    - List items that are JSON objects are formatted as above with an indentation increasing by 2 spaces
 *   > If the value is an object:
 *     o The key-value pairs are separated by a colon
 *     o Each key-value pair is separated by a newline
 *     o The key-value pairs are sorted by key
 *     o The object properties are enclosed in curly braces
 *
 */
export function prettyStringify(
  value: unknown,
  options?: FormatJsonOptions | undefined,
  indent = 0
): string {
  switch (typeof value) {
    case "string":
      return options?.quoteStrings ? `"${value}"` : value;
    case "boolean":
    case "number":
    case "undefined":
      return value.toString();
    case "function":
      return value.toString();
    case "object":
      if (value === null) {
        return "null";
      }

      if (Array.isArray(value)) {
        return formatArray(value, options, indent);
      }

      return formatObject(value as Record<string, unknown>, options, indent);
    default:
      throw new Error(`Unsupported object type: ${typeof value}`);
  }
}

function formatArray(
  array: object[],
  options: FormatJsonOptions | undefined,
  indent: number
): string {
  const formattedArray = array
    .map((value) => `${" ".repeat(indent + 2)}${prettyStringify(value, options, indent + 2)}`)
    .join(`,\n`);
  return `[\n${formattedArray}\n${" ".repeat(indent)}]`;
}

function formatObject(
  object: Record<string, unknown>,
  options?: FormatJsonOptions,
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
        return `${" ".repeat(indent + 2)}${keyModifier(key)}: ${valueModifier(value)}`;
      }

      return `${" ".repeat(indent + 2)}${keyModifier(key)}: ${prettyStringify(value, options, indent + 2)}`;
    })
    .join(`,\n`);
  return `{\n${formattedObject}\n${" ".repeat(indent)}}`;
}

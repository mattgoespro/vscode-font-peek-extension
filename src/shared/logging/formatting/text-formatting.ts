import boxen from "boxen";

/**
 * Centers each line of text bounded by a specified width.
 *
 * @param lines - A single string or an array of strings representing the lines of text to be centered.
 * @param width - The maximum width within which to center the text. If not provided, the width of the longest line is used.
 * @returns An array of strings where each string is a centered line of text.
 */
export function centerTextLines(lines: string | string[], width?: number): string[] {
  if (typeof lines === "string") {
    lines = [lines];
  }

  const maxLineWidth = lines.reduce(
    (maxWidth, line) => (line.length > maxWidth ? line.length : maxWidth),
    lines[0].length
  );

  if (width != null && width < maxLineWidth) {
    console.warn(
      `The specified width of ${width} is less than the maximum line width of ${maxLineWidth}.`
    );
  }

  return lines.map((line) => centerTextLine(line, width ?? maxLineWidth));
}

/**
 * Centers a given text within a specified line width by padding it with spaces.
 * If the text length is greater than or equal to the line width, a warning is logged and the original text is returned.
 *
 * @param text - The text to be centered.
 * @param lineWidth - The width of the line within which the text should be centered.
 * @returns The centered text padded with spaces, or the original text if it exceeds the specified line width.
 */
function centerTextLine(text: string, lineWidth: number): string {
  if (text.length >= lineWidth) {
    console.warn(
      `The text length of ${text.length} is greater than the specified line width of ${lineWidth}.`
    );
    return text;
  }

  return text.padStart((lineWidth + text.length) / 2, " ").padEnd(lineWidth, " ");
}

/**
 * Creates a nested box structure with the given content boxes.
 *
 * @param boxes - An array of content boxes, where each box has a title and contents.
 * @returns A formatted string that nests the content boxes within each other.
 */
export function nestContentBoxes(...boxes: { title: string; contents: string }[]) {
  let output = "";
  const reverseOrderedBoxes = boxes.reverse();
  for (let i = 0; i < reverseOrderedBoxes.length; i++) {
    const box = reverseOrderedBoxes[i];
    const boxWidth = output
      .split("\n")
      .reduce((maxWidth, line) => (line.length > maxWidth ? line.length : maxWidth), 0);
    output = boxen([box.contents, output].join("\n"), {
      title: box.title,
      titleAlignment: "center",
      textAlignment: "center",
      padding: 1,
      margin: 1,
      borderStyle: "double",
      width: boxWidth
    });
  }

  return output;
}

export type BoxOptions = {
  /**
	Color of the box border.
	*/
  readonly borderColor?:
    | "black"
    | "red"
    | "green"
    | "yellow"
    | "blue"
    | "magenta"
    | "cyan"
    | "white"
    | "gray"
    | "grey"
    | "blackBright"
    | "redBright"
    | "greenBright"
    | "yellowBright"
    | "blueBright"
    | "magentaBright"
    | "cyanBright"
    | "whiteBright"
    | string;

  readonly dimBorder?: boolean;
  readonly margin?: number;
  readonly backgroundColor?:
    | "black"
    | "red"
    | "green"
    | "yellow"
    | "blue"
    | "magenta"
    | "cyan"
    | "white"
    | "blackBright"
    | "redBright"
    | "greenBright"
    | "yellowBright"
    | "blueBright"
    | "magentaBright"
    | "cyanBright"
    | "whiteBright"
    | string;

  readonly align?: "left" | "right" | "center";

  readonly textAlignment?: "left" | "right" | "center";
  readonly title?: string;

  readonly titleAlignment?: "left" | "right" | "center";

  readonly width?: number;

  readonly height?: number;
};

/**
 * A self-implemented function that doesn't use `boxen` to generate a titled box with content. The box is styled with a border and padding. The title is optional.
 * @param title the title of the box
 * @param content the content of the box
 * @param options the options for the box
 * @returns the box as a string
 */
export function createBox(
  title: string,
  content: string,
  options: BoxOptions = {
    borderColor: "white",
    dimBorder: false,
    margin: 0,
    backgroundColor: "black",
    align: "left",
    textAlignment: "left",
    title: "",
    titleAlignment: "left",
    width: 0,
    height: 0
  }
): string {
  const {
    borderColor,
    dimBorder,
    margin,
    backgroundColor,
    align,
    textAlignment,
    title: boxTitle,
    titleAlignment,
    width,
    height
  } = options;

  const createBorder = (content: string): string => {
    const borderLength = Math.max(width, content.length + 2);
    const border = borderColor
      ? dimBorder
        ? `┌${"─".repeat(borderLength)}┐\n`
        : `┌${"─".repeat(borderLength)}┐\n`
      : "";
    return border;
  };

  const createTitle = (title: string): string => {
    const titleLength = Math.max(width, title.length);
    const titlePadding = " ".repeat(Math.floor((titleLength - title.length) / 2));
    return `${titlePadding}${title}${titlePadding}\n`;
  };

  const createContent = (content: string): string => {
    const contentLength = Math.max(width, content.length);
    const paddingLength = Math.max(0, Math.floor((contentLength - content.length) / 2));
    const contentPadding = " ".repeat(paddingLength);
    return `${contentPadding}${content}${contentPadding}\n`;
  };

  const createBox = (content: string): string => {
    const border = createBorder(content);
    const title = boxTitle ? createTitle(boxTitle) : "";
    const boxContent = createContent(content);
    return `${border}${title}${boxContent}${border}`;
  };

  const box = createBox(content);

  return box;
}

console.log(
  createBox(
    "Title",
    `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
  `,
    {
      borderColor: "white",
      dimBorder: false,
      margin: 0,
      backgroundColor: "black",
      align: "left",
      textAlignment: "left",
      title: "",
      titleAlignment: "left",
      width: 0,
      height: 0
    }
  )
);

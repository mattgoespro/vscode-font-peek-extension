import chalk from "chalk";

const Colors = {
  orange: "#ff8800",
  gold: "#CDAA35",
  darkGrey: "#3B3B3B",
  dark: "#0e0e0e",
  lightGrey: "#C5C5C5",
  darkPurple: "#6C0BA9",
  purple: "#A020F0",
  lightPurple: "#C576F6",
  darkGreen: "#035800"
};

Object.assign(chalk, {
  orange: chalk.hex(Colors.orange),
  gold: chalk.hex(Colors.gold),
  darkGrey: chalk.hex(Colors.darkGrey),
  dark: chalk.hex(Colors.dark),
  lightGrey: chalk.hex(Colors.lightGrey),
  purple: chalk.hex(Colors.darkPurple),
  lightPurple: chalk.hex(Colors.lightPurple),
  darkGreen: chalk.hex("#035800")
});

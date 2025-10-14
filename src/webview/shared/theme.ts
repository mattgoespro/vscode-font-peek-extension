import { createTheme } from "@mui/material";
import MuiCreateStyled from "@mui/system/createStyled";

export const theme = createTheme({
  palette: {
    mode: "dark",
    common: {
      black: "#111111",
      white: "#f0f0f0"
    },
    primary: {
      main: "#1976d2",
      light: "#4791db",
      dark: "#115293",
      contrastText: "#f0f0f0"
    },
    secondary: {
      main: "#dc004e",
      light: "#e33371",
      dark: "#9a0036",
      contrastText: "#f0f0f0"
    },
    error: {
      main: "#f44336",
      light: "#e57373",
      dark: "#d32f2f",
      contrastText: "#f0f0f0"
    },
    warning: {
      main: "#ff9800",
      light: "#ffb74d",
      dark: "#f57c00",
      contrastText: "#f0f0f0"
    },
    info: {
      main: "#2196f3",
      light: "#64b5f6",
      dark: "#1976d2",
      contrastText: "#f0f0f0"
    },
    success: {
      main: "#4caf50",
      light: "#81c784",
      dark: "#388e3c",
      contrastText: "#f0f0f0"
    },
    text: {
      primary: "#c5c5c5",
      secondary: "#969696",
      disabled: "#5f5f5f"
    },
    background: {
      default: "#111111",
      paper: "#1e1e1e"
    }
  },
  typography: (palette) => ({
    fontFamily: "Roboto, sans-serif",
    fontSize: 14,
    h1: {
      fontFamily: "Fira Code, Cascadia Code, monospace",
      fontSize: "3em",
      fontWeight: 500,
      lineHeight: 1.5,
      color: palette.getContrastText(palette.background.default),
      margin: "0.5rem",
      wordBreak: "break-word"
    },
    h2: {
      fontFamily: "Fira Code, Cascadia Code, monospace",
      fontSize: "1.5em",
      fontWeight: 300,
      lineHeight: 1.5,
      color: palette.text.secondary,
      margin: "0.5rem",
      wordBreak: "break-word"
    },
    h3: {
      fontSize: "1.25em",
      fontWeight: 500,
      color: "text.secondary",
      wordBreak: "break-word"
    },
    button: {
      fontFamily: "Nunito Sans, sans-serif",
      fontSize: "0.875em",
      color: "ButtonText",
      textTransform: "uppercase",
      textAlign: "center"
    },
    overline: {
      fontSize: "0.75em",
      textTransform: "uppercase",
      color: palette.text.secondary
    },
    body1: {
      fontSize: "1em",
      fontWeight: 400,
      color: palette.text.primary
    },
    body2: {
      fontSize: "0.875em",
      fontFamily: "Nunito Sans, sans-serif",
      fontWeight: 400,
      color: palette.text.primary
    },
    caption: {
      fontFamily: "Nunito Sans, Roboto, sans-serif",
      fontSize: "1em",
      fontWeight: 400,
      // fontFamily: "Inter, Roboto, sans-serif",
      // fontSize: "0.875em",
      // fontWeight: 300,
      letterSpacing: "0.25px",
      lineHeight: 1.25,
      color: palette.text.primary,
      textAlign: "center",
      wordBreak: "break-all"
    }
  }),
  spacing: 16,
  shape: {
    borderRadius: 4
  }
});

export const createStyled = MuiCreateStyled({
  defaultTheme: theme
});

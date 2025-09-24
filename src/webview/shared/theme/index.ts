import { createTheme } from "@mui/material";
import MuiCreateStyled from "@mui/system/createStyled";
import { components } from "./components";

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
      contrastText: "#fff"
    },
    secondary: {
      main: "#dc004e",
      light: "#e33371",
      dark: "#9a0036",
      contrastText: "#fff"
    },
    error: {
      main: "#f44336",
      light: "#e57373",
      dark: "#d32f2f",
      contrastText: "#fff"
    },
    warning: {
      main: "#ff9800",
      light: "#ffb74d",
      dark: "#f57c00",
      contrastText: "#fff"
    },
    info: {
      main: "#2196f3",
      light: "#64b5f6",
      dark: "#1976d2",
      contrastText: "#fff"
    },
    success: {
      main: "#4caf50",
      light: "#81c784",
      dark: "#388e3c",
      contrastText: "#fff"
    },
    text: {
      primary: "#696969",
      disabled: "#a9a9a9",
      secondary: "#808080"
    },
    background: {
      default: "#101010",
      paper: "#1e1e1e"
    }
  },
  typography: (palette) => ({
    fontFamily: "Roboto, sans-serif",
    fontSize: 14,
    h1: {
      fontFamily: "Open Sans, sans-serif",
      fontSize: "2em",
      fontWeight: 500,
      color: palette.getContrastText(palette.background.paper),
      margin: "0.5rem"
    },
    h2: {
      fontFamily: "Noto Sans Mono, sans-serif",
      fontSize: "1.5em",
      fontWeight: 500,
      color: palette.text.primary,
      margin: "0.5rem"
    },
    h3: {
      fontSize: "1.25em",
      fontWeight: 500,
      color: palette.text.primary
    },
    button: {
      fontFamily: "Nunito Sans, sans-serif",
      fontSize: "0.875em",
      fontWeight: 400,
      textTransform: "uppercase"
    },
    overline: {
      fontSize: "0.75em",
      fontWeight: 400,
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
      fontSize: "0.875em",
      fontWeight: 500,
      color: palette.text.primary
    }
  }),
  components,
  spacing: 16,
  shape: {
    borderRadius: 4
  }
});

export const createStyled = MuiCreateStyled({
  defaultTheme: theme
});

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
      fontFamily: "Fira Code, monospace",
      fontSize: "3em",
      fontWeight: 500,
      color: palette.getContrastText(palette.background.paper),
      margin: "0.5rem",
      wordBreak: "break-word"
    },
    h2: {
      fontFamily: "Fira Code, monospace",
      fontSize: "1.5em",
      fontWeight: 500,
      color: palette.text.primary,
      margin: "0.5rem",
      wordBreak: "break-word"
    },
    h3: {
      fontSize: "1.25em",
      fontWeight: 500,
      color: palette.text.primary,
      wordBreak: "break-word"
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
  components: {
    // MuiInput: {
    //   defaultProps: {
    //     color: "primary",
    //     size: "small"
    //   },
    //   variants: [
    //     {
    //       props: {
    //         sx: (theme) => {
    //           return {
    //             backgroundColor: theme.palette.background.paper,
    //             borderRadius: theme.shape.borderRadius,
    //             "&:hover": {
    //               backgroundColor: theme.palette.background.paper
    //             }
    //           };
    //         }
    //       },
    //       style: ({ theme }) => ({
    //         backgroundColor: theme.palette.background.paper
    //       })
    //     }
    //   ]
    // }
  },
  spacing: 16,
  shape: {
    borderRadius: 4
  }
});

export const createStyled = MuiCreateStyled({
  defaultTheme: theme
});

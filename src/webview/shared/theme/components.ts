import { Components, Theme } from "@mui/material";
import { shape } from "./shape";

export const components: Components<Theme> = {
  MuiButton: {
    defaultProps: {
      variant: "contained",
      color: "primary",
      size: "small"
    },
    variants: [
      {
        style: ({ theme }) => ({
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white,
          "&:hover": {
            backgroundColor: theme.palette.primary.light
          },
          "&:active": {
            borderColor: theme.palette.primary.dark
          }
        }),
        props: {
          variant: "contained",
          sx: (theme: Theme) => {
            return {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.common.white,
              "&:hover": {
                backgroundColor: theme.palette.primary.light
              }
            };
          }
        }
      }
    ]
  },
  MuiInput: {
    defaultProps: {
      size: "small"
    },
    variants: [
      {
        props: {
          sx: (theme) => {
            return {
              backgroundColor: theme.palette.background.paper,
              borderRadius: theme.shape.borderRadius,
              "&:hover": {
                backgroundColor: theme.palette.background.paper
              }
            };
          }
        },
        style: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          borderRadius: shape.borderRadius
        })
      }
    ]
  }
};

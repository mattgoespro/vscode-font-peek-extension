import { CSSProperties } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import { createStyled } from "../theme";

type FlexBoxProps = {
  direction: CSSProperties["flexDirection"];
  justify?: CSSProperties["justifyContent"];
  align?: CSSProperties["alignItems"];
  gap?: number;
} & Omit<BoxProps, "flexDirection" | "justifyContent" | "alignItems" | "gap">;

export const FlexBox = createStyled(Box, {
  label: "FlexBox",
  name: "FlexBox",
  shouldForwardProp: (prop: string) => !["direction", "justify", "align", "gap"].includes(prop)
})<FlexBoxProps>(
  ({ theme, direction = "column", justify = "flex-start", align = "flex-start", gap = 0 }) => {
    return {
      display: "flex",
      flexDirection: direction,
      justifyContent: justify,
      alignItems: align,
      gap: theme.spacing(gap)
    };
  }
);

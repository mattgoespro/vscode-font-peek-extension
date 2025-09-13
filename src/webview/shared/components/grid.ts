import Box from "@mui/material/Box";
import { createStyled } from "../theme";

type GridProps = {
  maxColumns: number;
  margin?: number | [number, number, number, number];
};

export const Grid = createStyled(Box, {
  name: "Grid",
  label: "Grid",
  shouldForwardProp: (prop: string) => !["maxColumns", "margin"].includes(prop)
})<GridProps>(({ maxColumns }) => {
  return {
    display: "grid",
    gridTemplateColumns: `repeat(auto-fit, minmax(min(${Math.floor(100 / maxColumns)}, 120px), 1fr))`,
    marginTop: "1rem"
  };
});

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { JSX } from "react";
import { uuid } from "../utils";

type GridViewProps = {
  columns: number;
  children: JSX.Element | JSX.Element[];
};

export function GridView({ columns, children }: GridViewProps) {
  return (
    <Grid
      container
      columns={columns}
      spacing={0.5}
      sx={{
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      {(Array.isArray(children) &&
        children.map((child) => (
          <Grid key={uuid()} size={1}>
            {child}
          </Grid>
        ))) || <Grid size={1}>{children}</Grid>}
    </Grid>
  );
}

export function GridItem({ children }: React.PropsWithChildren) {
  return <Box>{children}</Box>;
}

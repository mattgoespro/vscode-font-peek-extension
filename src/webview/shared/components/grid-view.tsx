import Grid from "@mui/material/Grid";
import { ReactNode } from "react";
import { uuid } from "../utils";

type GridViewProps = {
  numColumns: number;
  children: ReactNode[];
};

export function GridView({ numColumns, children }: GridViewProps) {
  return (
    <Grid container columns={numColumns} size="grow" spacing={0.5} sx={{ alignItems: "stretch" }}>
      {children.map((child) => (
        <Grid key={uuid()} size={1}>
          {child}
        </Grid>
      ))}
    </Grid>
  );
}

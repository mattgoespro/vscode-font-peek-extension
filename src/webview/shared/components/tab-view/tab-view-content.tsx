import Box from "@mui/material/Box";
import { JSX } from "react";

export interface TabViewContentProps {
  label: string;
  children: JSX.Element | JSX.Element[];
}

export function TabViewContent(props: TabViewContentProps) {
  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(auto-fill, minmax(100px, 1fr))"
      mt="1rem"
      gap="0.5rem"
      width="100%"
      maxWidth="calc(10 * 100px + 9 * 0.5rem)" // Max 10 columns and 9 gaps
      marginX="auto" // center the grid horizontally
      sx={{
        boxSizing: "border-box",
        overflowX: "hidden", // prevent scrollbar
      }}
    >
      {props.children}
    </Box>
  );
}

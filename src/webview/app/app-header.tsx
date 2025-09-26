import { Typography } from "@mui/material";
import { FlexBox } from "../shared/components/flex-box";

type AppHeaderProps = {
  fontName: string;
};

export function AppHeader({ fontName }: AppHeaderProps) {
  return (
    <FlexBox direction="column" align="center" mb={2}>
      <Typography variant="h2" fontFamily="Fira Code, Cascadia Code, monospace" textAlign="center">
        Preview of
      </Typography>
      <Typography variant="h1" fontFamily="Fira Code, Cascadia Code, monospace" textAlign="center">
        {fontName}
      </Typography>
    </FlexBox>
  );
}

import { Typography } from "@mui/material";
import { FlexBox } from "../shared/components/flex-box";

type AppHeaderProps = {
  fontName: string;
};

export function AppHeader({ fontName }: AppHeaderProps) {
  return (
    <FlexBox direction="column" align="center" mb={2}>
      <Typography variant="h2" textAlign="center" mb={0}>
        Preview of
      </Typography>
      <Typography variant="h1" textAlign="center" mt={0}>
        {fontName}
      </Typography>
    </FlexBox>
  );
}

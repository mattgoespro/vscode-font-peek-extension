import { Input } from "@mui/material";

type GlyphSearchProps = {
  onValueChange: (search: string) => void;
};

export function GlyphSearch(props: GlyphSearchProps) {
  return (
    <Input
      type="search"
      placeholder="Search for a glyph..."
      defaultValue=""
      onChange={(event) => {
        props.onValueChange((event.target as HTMLInputElement).value);
      }}
    />
  );
}

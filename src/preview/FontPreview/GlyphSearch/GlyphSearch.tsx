import * as styles from "./GlyphSearch.module.scss";

type GlyphSearchProps = {
  onValueChange: (search: string) => void;
};

export function GlyphSearch(props: GlyphSearchProps) {
  return (
    <input
      type="search"
      placeholder="Search for a glyph..."
      defaultValue=""
      className={styles["search-input"]}
      onChange={(event) => {
        props.onValueChange((event.target as HTMLInputElement).value);
      }}
    />
  );
}

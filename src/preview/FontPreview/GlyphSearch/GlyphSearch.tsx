import * as styles from "./GlyphSearch.module.scss";

type GlyphSearchProps = {
  onSearch: (search: string) => void;
};

export function GlyphSearch({ onSearch }: GlyphSearchProps) {
  return (
    <input
      type="search"
      placeholder="Search for a glyph..."
      defaultValue=""
      className={styles["search-input"]}
      onKeyUp={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          onSearch((event.target as HTMLInputElement).value);
        }
      }}
    />
  );
}

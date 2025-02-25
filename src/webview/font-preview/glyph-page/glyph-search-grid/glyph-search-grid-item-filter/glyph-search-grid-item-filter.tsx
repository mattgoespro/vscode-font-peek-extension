import * as styles from "./glyph-search-grid-item-filter.module.scss";

type GlyphSearchGridItemFilterProps = {
  onFilterChange: (filter: string) => void;
};

export function GlyphSearchGridItemFilter(props: GlyphSearchGridItemFilterProps) {
  return (
    <input
      type="search"
      placeholder="Search for a glyph..."
      defaultValue=""
      className={styles["search-input"]}
      onChange={(event) => {
        props.onFilterChange((event.target as HTMLInputElement).value);
      }}
    />
  );
}

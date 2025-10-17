import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import { SelectChangeEvent } from "@mui/material/Select/SelectInput";
import { useCallback, useState } from "react";
import { FlexBox } from "../../shared/components/flex-box";
import { UseGlyphsStateSortBy } from "../../shared/hooks/use-glyphs";

export type GlyphGridFilterCriteria = {
  name: string;
  unicode: string;
  sortBy: UseGlyphsStateSortBy;
};

type GlyphGridFilter = {
  criteriaChange: (criteria: GlyphGridFilterCriteria) => void;
};

export function GlyphGridFilter({ criteriaChange }: GlyphGridFilter) {
  const [filterCriteria, setFilterCriteria] = useState<GlyphGridFilterCriteria>({
    name: "",
    unicode: "",
    sortBy: ""
  });

  const onNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      criteriaChange({ ...filterCriteria, name: event.target.value });
    },
    [criteriaChange]
  );

  const onUnicodeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilterCriteria((prev) => {
        const newCriteria = { ...prev, unicode: event.target.value };
        criteriaChange(newCriteria);
        return newCriteria;
      });
    },
    [criteriaChange]
  );

  const onSortByChange = useCallback(
    (event: SelectChangeEvent) => {
      setFilterCriteria((prev) => {
        const newCriteria = { ...prev, sortBy: event.target.value as UseGlyphsStateSortBy };
        criteriaChange(newCriteria);
        return newCriteria;
      });
    },
    [criteriaChange]
  );

  return (
    <FlexBox direction="row" gap={1}>
      <OutlinedInput
        size="small"
        defaultValue=""
        onChange={onNameChange}
        placeholder="Search by name..."
      />
      <OutlinedInput
        size="small"
        defaultValue=""
        onChange={onUnicodeChange}
        placeholder="Search by unicode value..."
      />
      <Select
        size="small"
        variant="outlined"
        label="Sort By"
        displayEmpty
        notched={false}
        defaultValue=""
        onChange={onSortByChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value="name">Name</MenuItem>
        <MenuItem value="unicode">Unicode</MenuItem>
      </Select>
    </FlexBox>
  );
}

import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import { SelectChangeEvent } from "@mui/material/Select/SelectInput";
import { useCallback } from "react";
import { FlexBox } from "../../shared/components/flex-box";
import {
  UseGlyphsAction,
  UseGlyphsActions,
  UseGlyphsState,
  UseGlyphsStateSortBy
} from "../../shared/hooks/use-glyphs";

type GlyphGridFilter = {
  state: UseGlyphsState;
  dispatch: React.ActionDispatch<[action: UseGlyphsAction<keyof UseGlyphsActions>]>;
};

export function GlyphGridFilter({ state, dispatch }: GlyphGridFilter) {
  const onNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "change-search",
      payload: { filter: { name: event.target.value || "" } }
    });
  }, []);

  const onUnicodeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "change-search",
      payload: { filter: { unicode: event.target.value || "" } }
    });
  }, []);

  const onSortByChange = useCallback((event: SelectChangeEvent) => {
    dispatch({
      type: "change-search",
      payload: { sortBy: event.target.value as UseGlyphsStateSortBy } // TODO: Allow changing sort order
    });
  }, []);

  return (
    <FlexBox direction="row" gap={1}>
      <OutlinedInput
        size="small"
        value={state?.currentSearch.filter?.name?.toLowerCase() || ""}
        onChange={onNameChange}
        placeholder="Search by name..."
      />
      <OutlinedInput
        size="small"
        value={state?.currentSearch.filter?.unicode?.toLowerCase() || ""}
        onChange={onUnicodeChange}
        placeholder="Search by unicode value..."
      />
      <Select
        size="small"
        variant="outlined"
        label="Sort By"
        displayEmpty
        notched={false}
        value={state.currentSearch.sortBy}
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

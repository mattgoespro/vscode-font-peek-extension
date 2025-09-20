import TextField from "@mui/material/TextField";
import { SelectChangeEvent } from "@mui/material/Select/SelectInput";
import { useCallback, useState } from "react";
import {
  UseGlyphsState,
  UseGlyphsAction,
  UseGlyphsActions,
  UseGlyphsStateSortOrder
} from "../../shared/hooks/use-glyphs";
import { FlexBox } from "../../shared/components/flex-box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";

type GlyphGridFilter = {
  state: UseGlyphsState;
  dispatch: React.ActionDispatch<[action: UseGlyphsAction<keyof UseGlyphsActions>]>;
};

export function GlyphGridFilter({ state, dispatch }: GlyphGridFilter) {
  const [sortOrder, setSortOrder] = useState<keyof UseGlyphsStateSortOrder>();

  const handleSortOrderChange = useCallback((event: SelectChangeEvent) => {
    setSortOrder(event.target.value as keyof UseGlyphsStateSortOrder);
  }, []);

  return (
    <FlexBox direction="row" gap={1}>
      <TextField
        variant="outlined"
        size="medium"
        value={state?.currentSearch?.fields?.name?.toLowerCase() || ""}
        onChange={(event) =>
          dispatch({
            type: "change-search",
            payload: { fields: { ...state.currentSearch.fields, name: event.target.value || "" } }
          })
        }
        placeholder="Search by name..."
      />
      <TextField
        variant="outlined"
        size="medium"
        value={state?.currentSearch?.fields?.name?.toLowerCase() || ""}
        onChange={(event) =>
          dispatch({
            type: "change-search",
            payload: {
              fields: { ...state.currentSearch.fields, name: event.target.value || "" }
            }
          })
        }
        placeholder="Search by unicode value..."
      />
      <Select
        variant="outlined"
        size="small"
        value={sortOrder || ""}
        onChange={handleSortOrderChange}
        label="Sort By"
        // set the maximum menu option height
        MenuProps={{
          PaperProps: {
            style: {
              fontSize: 11,
              fontWeight: "normal",
              maxHeight: "3rem"
            }
          }
        }}
        input={<OutlinedInput placeholder="Sort By" size="small"></OutlinedInput>}
      >
        <MenuItem value="name">Name</MenuItem>
        <MenuItem value="unicode">Unicode</MenuItem>
      </Select>
    </FlexBox>
  );
}

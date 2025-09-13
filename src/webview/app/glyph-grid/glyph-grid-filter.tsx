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
  const [sortOrderConstraint, setSortOrderConstraint] = useState<keyof UseGlyphsStateSortOrder>();

  const handleChange = useCallback((event: SelectChangeEvent) => {
    if (!isValidSortOrder(event.target.value)) {
      return;
    }

    setSortOrderConstraint(event.target.value);
  }, []);

  const isValidSortOrder = useCallback((value: string): value is keyof UseGlyphsStateSortOrder => {
    return value === "name" || value === "unicode";
  }, []);

  return (
    <FlexBox direction="column" gap={1}>
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
        value={sortOrderConstraint || ""}
        onChange={handleChange}
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

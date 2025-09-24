import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import { SelectChangeEvent } from "@mui/material/Select/SelectInput";
import TextField from "@mui/material/TextField";
import { useCallback } from "react";
import { FlexBox } from "../../shared/components/flex-box";
import { UseGlyphsAction, UseGlyphsActions, UseGlyphsState } from "../../shared/hooks/use-glyphs";

type GlyphGridFilter = {
  state: UseGlyphsState;
  dispatch: React.ActionDispatch<[action: UseGlyphsAction<keyof UseGlyphsActions>]>;
};

export function GlyphGridFilter({ state, dispatch }: GlyphGridFilter) {
  const handleSortOrderChange = useCallback((event: SelectChangeEvent) => {
    dispatch({
      type: "change-search",
      payload: { sortOrder: { [event.target.value]: "asc" } }
    });
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
        autoWidth={true}
        value={state?.currentSearch?.sortBy || ""}
        onChange={handleSortOrderChange}
        label="Sort By"
        slotProps={{ root: { sx: { height: "100%" } } }}
        MenuProps={{
          PaperProps: {
            style: {
              color: "var(--vscode-foreground)"
            }
          }
        }}
        input={<OutlinedInput placeholder="Sort By" size="medium"></OutlinedInput>}
      >
        <MenuItem value="name">Name</MenuItem>
        <MenuItem value="unicode">Unicode</MenuItem>
      </Select>
    </FlexBox>
  );
}

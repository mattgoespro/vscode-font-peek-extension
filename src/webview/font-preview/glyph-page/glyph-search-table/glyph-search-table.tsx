import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton
} from "material-react-table";
import { Box, Button, lighten } from "@mui/material";
import { FontGlyph } from "@shared/model";
import { GlyphPageItem } from "../glyph-page-item/glyph-page-item";

type GlyphSearchTableProps = {
  glyphs: FontGlyph[];
};

export function GlyphSearchTable(props: GlyphSearchTableProps) {
  const columns = useMemo<MRT_ColumnDef<FontGlyph>[]>(
    () => [
      {
        id: "name", // defines the `group` column
        header: "Name",
        accessorFn: (row) => row.name,
        size: 50,
        Cell: ({ renderedCellValue: _, row }) => <GlyphPageItem glyph={row.original} />
      }
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: props.glyphs,
    mrtTheme: () => ({
      baseBackgroundColor: "#101010",
      cellNavigationOutlineColor: "#ff7c30",
      menuBackgroundColor: "#4b4b4b",
      selectedRowBackgroundColor: "#292929"
    }),
    enableFacetedValues: true,
    initialState: {
      // showColumnFilters: true,
      // showGlobalFilter: false,
      columnPinning: {
        // left: ["mrt-row-expand", "mrt-row-select"],
        // right: ["mrt-row-actions"]
      }
    },
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined"
    },
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [10, 50, 100],
      shape: "rounded",
      variant: "outlined"
    },
    // renderDetailPanel: ({ row }) => (
    //   <Box
    //     sx={{
    //       alignItems: 'center',
    //       display: 'flex',
    //       justifyContent: 'space-around',
    //       left: '30px',
    //       maxWidth: '1000px',
    //       position: 'sticky',
    //       width: '100%',
    //     }}
    //   >
    //     <img
    //       alt="avatar"
    //       height={200}
    //       src={row.original.unicode}
    //       loading="lazy"
    //       style={{ borderRadius: '50%' }}
    //     />
    //     <Box sx={{ textAlign: 'center' }}>
    //       <Typography variant="h4">Signature Catch Phrase:</Typography>
    //       <Typography variant="h1">
    //         &quot;{row.original.signatureCatchPhrase}&quot;
    //       </Typography>
    //     </Box>
    //   </Box>
    // ),
    renderTopToolbar: ({ table }) => {
      const handleDeactivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert("deactivating " + row.getValue("name"));
        });
      };

      const handleActivate = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert("activating " + row.getValue("name"));
        });
      };

      const handleContact = () => {
        table.getSelectedRowModel().flatRows.map((row) => {
          alert("contact " + row.getValue("name"));
        });
      };

      return (
        <Box
          sx={(theme) => ({
            backgroundColor: lighten(theme.palette.background.default, 0.05),
            display: "flex",
            gap: "0.5rem",
            p: "8px",
            justifyContent: "space-between"
          })}
        >
          <Box sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            {/* import MRT sub-components */}
            <MRT_GlobalFilterTextField table={table} />
            <MRT_ToggleFiltersButton table={table} />
          </Box>
          <Box>
            <Box sx={{ display: "flex", gap: "0.5rem" }}>
              <Button
                color="error"
                disabled={!table.getIsSomeRowsSelected()}
                onClick={handleDeactivate}
                variant="contained"
              >
                Deactivate
              </Button>
              <Button
                color="success"
                disabled={!table.getIsSomeRowsSelected()}
                onClick={handleActivate}
                variant="contained"
              >
                Activate
              </Button>
              <Button
                color="info"
                disabled={!table.getIsSomeRowsSelected()}
                onClick={handleContact}
                variant="contained"
              >
                Contact
              </Button>
            </Box>
          </Box>
        </Box>
      );
    }
  });

  return <MaterialReactTable table={table} />;
}

import { useState } from "react";
import { getChunkSize, PAGINATION_MAX_NUM_PAGES } from "./glyph-pagination.model";
import { Button, Container, Typography } from "@mui/material";

type GlyphPaginationProps = {
  totalGlyphs: number;
  onPageChange: (page: number) => void;
};

export function GlyphPagination({ totalGlyphs, onPageChange }: GlyphPaginationProps) {
  const [currentPage, setCurrentPage] = useState(0);

  function glyphRangeText() {
    const chunkSize = getChunkSize(totalGlyphs);
    const start = currentPage * chunkSize + 1;
    const end = Math.min(start + chunkSize - 1, totalGlyphs);
    return `${start} - ${end}`;
  }

  function handlePageChange(event: React.MouseEvent<HTMLButtonElement>) {
    setCurrentPage(+event.currentTarget.value);
    onPageChange(+event.currentTarget.value);
  }

  return (
    <Container>
      {Array.from({ length: PAGINATION_MAX_NUM_PAGES }, (_, i) => (
        <Button variant="outlined" key={i} onClick={handlePageChange}>
          <Typography variant="button">{glyphRangeText()}</Typography>
        </Button>
      ))}
    </Container>
  );
}

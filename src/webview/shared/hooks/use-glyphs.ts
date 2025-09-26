import { Glyph } from "opentype.js";
import { useReducer } from "react";

type UseGlyphsStateSortConstraints = Partial<{
  [key in keyof Pick<Glyph, "name" | "unicode">]: "asc" | "desc";
}>;

export type UseGlyphsStateSortBy = keyof UseGlyphsStateSortConstraints;

export type UseGlyphsState = {
  allGlyphs: Glyph[];
  pageSize: number;
  numPages: number;
  currentPage: number;
  currentSearch: {
    filter?: UseGlyphsStateSearchFilter;
    sortBy?: UseGlyphsStateSortBy;
    sortOrder?: UseGlyphsStateSortConstraints;
  };
  currentMatchingGlyphs: Glyph[];
  currentPageGlyphs: Glyph[];
};

type UseGlyphsStateSearchFilter = {
  name?: string;
  unicode?: string;
};

export type UseGlyphsActions = {
  load: {
    glyphs: Glyph[];
  };
  "change-page": {
    page: number;
  };
  "change-search": {
    filter?: UseGlyphsStateSearchFilter;
    sortBy?: UseGlyphsStateSortBy;
    sortOrder?: UseGlyphsStateSortConstraints;
  };
};

export type UseGlyphsAction<Action extends keyof UseGlyphsActions> = {
  type: Action;
  payload: UseGlyphsActions[Action];
};

const useGlyphsInitialState: UseGlyphsState = {
  allGlyphs: null,
  pageSize: null,
  numPages: null,
  currentPage: null,
  currentSearch: {
    filter: {
      name: "",
      unicode: ""
    },
    sortBy: "name",
    sortOrder: undefined
  },
  currentMatchingGlyphs: null,
  currentPageGlyphs: null
};

export function useGlyphs() {
  return useReducer(glyphsReducer, useGlyphsInitialState);
}

function glyphsReducer<Action extends keyof UseGlyphsActions>(
  state: UseGlyphsState,
  action: UseGlyphsAction<Action>
): UseGlyphsState {
  const UseGlyphsDefaultGridPageSize = 100;

  switch (action.type) {
    case "load": {
      const { glyphs } = (action as UseGlyphsAction<"load">).payload;

      return {
        ...state,
        allGlyphs: glyphs,
        pageSize: UseGlyphsDefaultGridPageSize,
        numPages: getNumPages(glyphs, UseGlyphsDefaultGridPageSize),
        currentPage: 0,
        currentPageGlyphs: getPageGlyphs(glyphs, 0, UseGlyphsDefaultGridPageSize)
      };
    }
    case "change-page": {
      const { page } = (action as UseGlyphsAction<"change-page">).payload;
      const { allGlyphs, pageSize, currentSearch, currentMatchingGlyphs } = state;

      let matchingGlyphs = hasFilterCriteria(currentSearch.filter)
        ? currentMatchingGlyphs
        : allGlyphs;

      if (matchingGlyphs == null) {
        matchingGlyphs = filterMatchingGlyphs(allGlyphs, currentSearch.filter);
      }

      const pageGlyphs = getPageGlyphs(matchingGlyphs, page, pageSize);
      console.log(`Loading ${pageGlyphs.length} glyphs on page ${page + 1}.`);

      return {
        ...state,
        currentPage: page,
        currentPageGlyphs: pageGlyphs,
        currentMatchingGlyphs: matchingGlyphs
      };
    }
    case "change-search": {
      const { filter, sortBy, sortOrder } = (action as UseGlyphsAction<"change-search">).payload;
      const { currentPage, pageSize, allGlyphs } = state;
      const mergedFilterCriteria = {
        ...state.currentSearch.filter,
        ...filter
      };
      const currentMatchingGlyphs = filterMatchingGlyphs(allGlyphs, mergedFilterCriteria);

      return {
        ...state,
        currentSearch: {
          filter: mergedFilterCriteria,
          sortBy: sortBy ?? state.currentSearch.sortBy,
          sortOrder: sortOrder ?? state.currentSearch.sortOrder
        },
        currentMatchingGlyphs,
        currentPageGlyphs: getPageGlyphs(currentMatchingGlyphs, currentPage, pageSize)
      };
    }
  }
}

function hasFilterCriteria(fields: UseGlyphsStateSearchFilter) {
  return (fields.name ?? "").length > 0 || (fields.unicode ?? "").length > 0;
}

function filterMatchingGlyphs(glyphs: Glyph[], fields: UseGlyphsStateSearchFilter) {
  if (!hasFilterCriteria(fields)) {
    return glyphs;
  }

  return glyphs.filter((glyph) => {
    if (glyph.unicode == null) {
      console.warn(`Glyph ${glyph.name} has no unicode value.`);
    }

    const matchesName =
      fields.name.length === 0 || glyph.name.toLowerCase().includes(fields.name.toLowerCase());
    const matchesUnicode =
      fields.unicode.length === 0 || (glyph.unicode ?? -1).toString().includes(fields.unicode);

    return matchesName && matchesUnicode;
  });
}

export function getNumPages(glyphs: Glyph[], pageSize: number) {
  if (glyphs.length === 0) {
    return 0;
  }

  return Math.ceil(glyphs.length / pageSize);
}

function getPageGlyphs(glyphs: Glyph[], page: number, pageSize: number) {
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;

  if (startIndex >= glyphs.length) {
    return [];
  }

  return glyphs.slice(startIndex, endIndex);
}

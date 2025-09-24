import { Glyph } from "opentype.js";
import { useReducer } from "react";

export type UseGlyphsStateSortConstraints = Partial<{
  [key in keyof Pick<Glyph, "name" | "unicode">]: "asc" | "desc";
}>;

export type UseGlyphsStateSortOrder = keyof UseGlyphsStateSortConstraints;

export type UseGlyphsState = {
  allGlyphs: Glyph[];
  pageSize: number;
  numPages: number;
  currentPage: number;
  currentSearch: {
    fields?: UseGlyphsStateSearchField;
    sortBy?: UseGlyphsStateSortOrder;
    sortOrder?: UseGlyphsStateSortConstraints;
  };
  currentMatchingGlyphs: Glyph[];
  pageGlyphs: Glyph[];
};

type UseGlyphsStateSearchField = {
  name: string;
  unicode: string;
};

export type UseGlyphsActions = {
  load: {
    glyphs: Glyph[];
  };
  "change-page": {
    page: number;
  };
  "change-search": {
    fields?: UseGlyphsStateSearchField;
    sortBy?: UseGlyphsStateSortOrder;
    sortOrder?: UseGlyphsStateSortConstraints;
  };
};

export type UseGlyphsAction<Action extends keyof UseGlyphsActions> = {
  type: Action;
  payload: UseGlyphsActions[Action];
};

export function useGlyphs() {
  const useGlyphsInitialState: UseGlyphsState = {
    allGlyphs: null,
    pageSize: null,
    numPages: null,
    currentPage: null,
    currentSearch: {
      fields: {
        name: "",
        unicode: ""
      },
      sortBy: "name",
      sortOrder: undefined
    },
    currentMatchingGlyphs: null,
    pageGlyphs: null
  };

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
        pageGlyphs: getPageGlyphs(glyphs, 0, UseGlyphsDefaultGridPageSize),
        currentSearch: {
          fields: {
            name: "",
            unicode: ""
          },
          sortBy: "name",
          sortOrder: undefined
        }
      };
    }
    case "change-page": {
      const { page } = (action as UseGlyphsAction<"change-page">).payload;
      const { allGlyphs, pageSize, currentSearch, currentMatchingGlyphs } = state;

      let matchingGlyphs =
        currentSearch.fields.name.length + currentSearch.fields.unicode.length === 0
          ? allGlyphs
          : currentMatchingGlyphs;

      if (matchingGlyphs == null) {
        matchingGlyphs = filterMatchingGlyphs(allGlyphs, currentSearch.fields);
      }

      const pageGlyphs = getPageGlyphs(matchingGlyphs, page, pageSize);
      console.log(`Loading ${pageGlyphs.length} glyphs on page ${page + 1}.`);

      return {
        ...state,
        currentPage: page,
        pageGlyphs,
        currentMatchingGlyphs: matchingGlyphs
      };
    }
    case "change-search": {
      const { fields, sortBy, sortOrder } = (action as UseGlyphsAction<"change-search">).payload;
      const { currentPage, pageSize, allGlyphs } = state;
      const currentMatchingGlyphs = filterMatchingGlyphs(allGlyphs, fields);
      console.log(
        `Found ${currentMatchingGlyphs.length} glyphs matching filter fields: ${Object.entries(
          fields
        )
          .map(([key, value]) => `${key} = ${value}`)
          .join(", ")}`
      );

      return {
        ...state,
        currentSearch: {
          fields: fields ?? {
            name: "",
            unicode: ""
          },
          sortBy: sortBy ?? state.currentSearch.sortBy,
          sortOrder: sortOrder ?? state.currentSearch.sortOrder
        },
        currentMatchingGlyphs,
        pageGlyphs: getPageGlyphs(currentMatchingGlyphs, currentPage, pageSize)
      };
    }
  }
}

function filterMatchingGlyphs(glyphs: Glyph[], fields: UseGlyphsStateSearchField) {
  if (fields.unicode.length === 0 && fields.unicode.length === 0) {
    return glyphs;
  }

  return glyphs.filter((glyph) => {
    const matchesName =
      fields.name.length === 0 || glyph.name.toLowerCase().includes(fields.name.toLowerCase());
    const matchesUnicode =
      fields.unicode.length === 0 || glyph.unicode?.toString().includes(fields.unicode);

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

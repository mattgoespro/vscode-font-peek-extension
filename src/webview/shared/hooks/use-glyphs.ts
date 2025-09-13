import { Glyph } from "opentype.js";
import { useReducer } from "react";

export const DEFAULT_GRID_PAGE_SIZE = 100;

export type UseGlyphsStateSortOrder = Partial<{
  [key in keyof Pick<Glyph, "name" | "unicode">]: "asc" | "desc";
}>;

export type UseGlyphsState = {
  allGlyphs: Glyph[];
  pageSize: number;
  numPages: number;
  currentPage: number;
  currentSearch: {
    fields?: UseGlyphsStateSearchField;
    sortOrder?: UseGlyphsStateSortOrder;
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
    sortOrder?: UseGlyphsStateSortOrder;
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
      sortOrder: {
        name: "asc"
      }
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
  console.log(action);
  switch (action.type) {
    case "load": {
      const { glyphs } = (action as UseGlyphsAction<"load">).payload;

      return {
        ...state,
        allGlyphs: glyphs,
        pageSize: DEFAULT_GRID_PAGE_SIZE,
        numPages: getNumPages(glyphs, DEFAULT_GRID_PAGE_SIZE),
        currentPage: 0,
        pageGlyphs: getPageGlyphs(glyphs, 0, DEFAULT_GRID_PAGE_SIZE),
        currentSearch: {
          fields: {
            name: "",
            unicode: ""
          },
          sortOrder: {
            name: "asc"
          }
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
        matchingGlyphs = findMatchingGlyphs(allGlyphs, currentSearch.fields);
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
      const { fields, sortOrder } = (action as UseGlyphsAction<"change-search">).payload;
      const { currentPage, pageSize, allGlyphs } = state;
      const currentMatchingGlyphs = findMatchingGlyphs(allGlyphs, fields);
      console.log(
        `Found ${currentMatchingGlyphs.length} glyphs matching ${Object.entries(fields)
          .map(([key, value]) => `${key} = ${value}`)
          .join(", ")}.`
      );

      return {
        ...state,
        currentSearch: {
          fields: fields ?? {
            name: "",
            unicode: ""
          },
          sortOrder: sortOrder ?? state.currentSearch.sortOrder
        },
        currentMatchingGlyphs,
        pageGlyphs: getPageGlyphs(currentMatchingGlyphs, currentPage, pageSize)
      };
    }
  }
}

function findMatchingGlyphs(glyphs: Glyph[], fields: UseGlyphsStateSearchField) {
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

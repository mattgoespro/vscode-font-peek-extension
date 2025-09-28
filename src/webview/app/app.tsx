import { ThemeProvider, Typography } from "@mui/material";
import { LoadFontEvent, WebviewStateChangedEvent } from "@shared/message/messages";
import { FontSpec } from "@shared/model";
import opentype, { Glyph } from "opentype.js";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { FlexBox } from "../shared/components/flex-box";
import { FontContext } from "../shared/contexts/font-context";
import { VsCodeApiContext } from "../shared/contexts/vscode-api-context";
import { useOutputPanel } from "../shared/hooks/use-output-panel";
import { theme } from "../shared/theme";
import { AppHeader } from "./app-header";
import { GlyphGrid } from "./glyph-grid/glyph-grid";
import CircularProgress from "@mui/material/CircularProgress";

export function App() {
  const [fontSpec, setFontSpec] = useState<FontSpec>(null);
  const [error, setError] = useState<string>(null);
  const vscodeApi = useContext(VsCodeApiContext);
  const outputPanel = useOutputPanel();

  const loadFont = useCallback(async (fileUri: string) => {
    const fontData = await fetch(fileUri);
    const fontDataBuffer = await fontData.arrayBuffer();

    const font = opentype.parse(fontDataBuffer);

    const glyphs: Glyph[] = [];

    for (let i = 0; i < font.glyphs.length; i++) {
      const glyph = font.glyphs.get(i);

      if (glyph.unicode == null) {
        continue;
      }

      glyphs.push(glyph);
    }

    setFontSpec({
      name: font.names.fullName.en,
      glyphs,
      features: {
        unitsPerEm: font.unitsPerEm,
        headTable: font.tables.head
      }
    });
  }, []);

  const onMessage = useCallback(async (message: MessageEvent<LoadFontEvent>) => {
    outputPanel.info(`Webview received message from extension:`, message.data);

    switch (message.data.name) {
      case "load-font": {
        try {
          await loadFont(message.data.payload.fileUri);
        } catch (error) {
          outputPanel.error("Failed to load font:", error);
          setError("Failed to load font. See output panel for details.");
        }
        break;
      }
      default:
        break;
    }
  }, []);

  useEffect(() => {
    vscodeApi.postMessage<WebviewStateChangedEvent>({
      name: "webview-state-changed",
      payload: {
        state: "ready"
      }
    });

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const LoadingIndicator = useMemo(() => {
    return (
      <Typography
        variant="caption"
        color="textSecondary"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={1}
      >
        Loading font
        <CircularProgress color="inherit" />
      </Typography>
    );
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {
        /*
         * TODO: See if the `CssBaseline` component is useful and is worth enabling.
         * @see https://mui.com/material-ui/react-css-baseline
         */
        // <CssBaseline enableColorScheme />
      }
      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}
      {!error && !fontSpec && LoadingIndicator}
      {!error && fontSpec && (
        <FlexBox id="app-root" direction="column" align="center" width="100%" m={2} gap={2}>
          <AppHeader fontName={fontSpec?.name} />
          <FontContext.Provider value={{ fontSpec }}>
            <GlyphGrid />
          </FontContext.Provider>
        </FlexBox>
      )}
      {error && <>Error: {error}</>}
    </ThemeProvider>
  );
}

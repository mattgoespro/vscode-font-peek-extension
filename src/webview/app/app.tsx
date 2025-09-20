import { useState, useEffect, useCallback, useContext } from "react";
import { ThemeProvider } from "@mui/material";
import { FontContext } from "../shared/contexts/font-context";
import { theme } from "../shared/theme";
import { GlyphGrid } from "./glyph-grid/glyph-grid";
import { FontSpec } from "@shared/model";
import opentype, { Glyph } from "opentype.js";
import { VsCodeApiContext } from "../shared/contexts/vscode-api-context";
import { useOutputPanel } from "../shared/hooks/use-output-panel";
import { LoadFontEvent, WebviewStateChangedEvent } from "@shared/message/messages";

export function App() {
  const [fontSpec, setFontSpec] = useState<FontSpec>(null);
  const [error, setError] = useState<string>(null);
  const vscodeApi = useContext(VsCodeApiContext);
  const outputPanel = useOutputPanel();

  const loadFont = useCallback(async (fileUri: string) => {
    const fontData = await fetch(fileUri);
    const fontDataBuffer = await fontData.arrayBuffer();

    try {
      const font = opentype.parse(fontDataBuffer);

      const glyphs: Glyph[] = [];

      for (let i = 0; i < font.glyphs.length; i++) {
        const glyph = font.glyphs.get(i);
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
    } catch (error) {
      outputPanel.error("Failed to load font:", error);
      setError("Failed to load font. See output panel for details.");
    }
  }, []);

  const onMessage = useCallback(async (message: MessageEvent<LoadFontEvent>) => {
    outputPanel.info(`Webview received message from extension:`, message.data);

    switch (message.data.name) {
      case "load-font": {
        await loadFont(message.data.payload.fileUri);
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

  return (
    <ThemeProvider theme={theme}>
      <FontContext.Provider value={{ fontSpec }}>
        {error && <>Error: {error}</>}
        {!error && (
          <>{(fontSpec && <GlyphGrid fontSpec={fontSpec} />) || <>Loading preview...</>}</>
        )}
      </FontContext.Provider>
    </ThemeProvider>
  );
}

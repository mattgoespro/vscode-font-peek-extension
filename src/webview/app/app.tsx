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
  const vscodeApi = useContext(VsCodeApiContext);
  const outputPanel = useOutputPanel();

  const loadFont = useCallback(async (fontUri: string) => {
    outputPanel.info(`Loading font from URI: ${fontUri}`);
    const fontData = await fetch(fontUri);
    const fontDataBuffer = await fontData.arrayBuffer();
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
        {(fontSpec != null && <GlyphGrid fontSpec={fontSpec} />) || <div>Loading font...</div>}
      </FontContext.Provider>
    </ThemeProvider>
  );
}

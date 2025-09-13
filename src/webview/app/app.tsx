import { useCallback, useContext, useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material";
import { FontContext } from "../shared/contexts/font-context";
import { theme } from "../shared/theme";
import { GlyphGrid } from "./glyph-grid/glyph-grid";
// import { VsCodeContext } from "../shared/contexts/vscode-api-context";
import { LoadFontEvent, WebviewStateChangedEvent } from "@shared/message/messages";
import { FontSpec } from "@shared/model";
import opentype, { Glyph } from "opentype.js";
import { useOutputPanel } from "../shared/hooks/use-output-panel";

interface AppProps {
  vscodeApi: VsCodeApi;
  fontUri: string;
}

export function App({ vscodeApi, fontUri }: AppProps) {
  const [fontSpec, setFontSpec] = useState<FontSpec>(null);
  // const webviewApi = useContext(VsCodeContext);
  // const outputPanel = useOutputPanel();

  // const loadFont = useCallback(
  //   async (payload: FontLoadEvent["payload"]) => {
  //     try {
  //       const fontLoader = new FontLoaderService(payload);

  //       const { font } = await fontLoader.loadFont();
  //       // Create the glyph list after loading the font, otherwise the payload is too large.
  //       const glyphs = fontLoader.getGlyphList(font);

  //       log.info(`Loaded ${glyphs.length} glyphs from font '${payload.fileName}'`);

  //       setFont(font);
  //       setFontFileName(payload.fileName);
  //       setGlyphs(glyphs);
  //     } catch (err) {
  //       log.error("Failed to load font.", err);
  //     }
  //   },
  //   [log, webviewApi]
  // );

  const onMessage = useCallback(
    async (message: MessageEvent<LoadFontEvent>) => {
      // outputPanel.info(`Webview received message from extension:`, message);

      switch (message.data.name) {
        case "load-font": {
          console.log("Received font URI to load:", message.data.payload.fileUri);
          const fontData = await fetch(message.data.payload.fileUri);
          const arrayBuffer = await fontData.arrayBuffer();
          const font = opentype.parse(arrayBuffer);
          console.log(font.glyphs);
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
          break;
        }
        default:
          break;
      }
    },
    []
    // [webviewApi]
  );

  const loadFont = useCallback(
    async (fileUri: string) => {
      try {
        const fontData = await fetch(fileUri);
        const arrayBuffer = await fontData.arrayBuffer();
        const font = opentype.parse(arrayBuffer);
        console.log(font.glyphs);
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
        // outputPanel.error("Failed to load font.", error);
      }
    },
    []
    // [webviewApi]
  );

  useEffect(() => {
    if (fontUri == null) {
      return;
    }

    async function loadFont() {
      console.log("Received font URI to load:", fontUri);
      const fontData = await fetch(fontUri);
      const arrayBuffer = await fontData.arrayBuffer();
      const font = opentype.parse(arrayBuffer);
      console.log(font.glyphs);
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
    }

    loadFont();
  }, [fontUri]);

  return (
    <ThemeProvider theme={theme}>
      {/* <VsCodeContext.Provider value={webviewApi}> */}
      <FontContext.Provider value={{ fontSpec }}>
        {(fontSpec != null && <GlyphGrid fontSpec={fontSpec} />) || <div>Loading font...</div>}
      </FontContext.Provider>
      {/* </VsCodeContext.Provider> */}
    </ThemeProvider>
  );
}

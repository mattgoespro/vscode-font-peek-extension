import fontkit from "fontkit";
import vscode from "vscode";
import { FontGlyph } from "../shared/model";

export function loadFont(outputChannel: vscode.OutputChannel, buffer: Buffer) {
  const font = loadFontData(buffer);
  return extractFontGlyphs(outputChannel, font);
}

function loadFontData(buffer: Buffer) {
  const font = fontkit.create(buffer);
  console.log(font);

  if (isFontCollection(font)) {
    vscode.window.showInformationMessage(`Font loaded with type ${font.type}.`);
    vscode.window.showInformationMessage("Loaded font as a font collection.");
  }

  return font as fontkit.Font;
}

function isFontCollection(
  font: fontkit.Font | fontkit.FontCollection
): font is fontkit.FontCollection {
  return (font as fontkit.FontCollection).fonts !== undefined;
}

export function extractFontGlyphs(outputChannel: vscode.OutputChannel, font: fontkit.Font) {
  const glyphs: FontGlyph[] = [];

  for (let i = 0; i < font.characterSet.length; i++) {
    const glyph = font.glyphForCodePoint(font.characterSet[i]);
    const id = glyph.id;
    const name = glyph.name;

    if (glyph.codePoints.length > 1) {
      outputChannel.appendLine(`Glyph ${name} has more than one code point.`);
    }

    glyphs.push({
      id,
      name,
      unicode: String.fromCodePoint(...glyph.codePoints)
    });
  }

  return glyphs;
}

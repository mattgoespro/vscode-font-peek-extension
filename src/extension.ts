import vscode from "vscode";
import { TTFEditorProvider } from "./ttfPreview";
import ReactDOMServer from "react-dom/server";

// // Define your React component for font glyph preview
// const FontGlyphPreview: React.FunctionComponent = () => {
//   // Your logic for displaying font glyphs here
//   return (
//     <div>
//       <h1>Test React Dom Glyph Preview</h1>
//     </div>
//   );
// };

export function activate(context: vscode.ExtensionContext) {
  // ReactDOMServer.renderToString(<FontGlyphPreview />);
  console.log("Congratulations, your extension 'ttf-preview' is now active!");
  context.subscriptions.push(TTFEditorProvider.register(context));
}

export function deactivate() {}

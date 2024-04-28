import path from "path";
import * as vscode from "vscode";

function getMetaContentAttr(webview: vscode.Webview) {
  return [
    `img-src ${webview.cspSource} https:`,
    `script-src ${webview.cspSource} 'unsafe-inline'`
  ].join(";");
}

function getFonts() {
  return /*html*/ `
    <!-- Google Fonts - Quick load from CDN -->
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <!-- Google Fonts API -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?${[
      "family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900",
      "family=Nunito:ital,wght@0,200..1000;1,200..1000",
      "family=Raleway:ital,wght@0,100..900;1,100..900",
      "family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900",
      "family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700",
      "family=Work+Sans:ital,wght@0,100..900;1,100..900",
      "display=swap"
    ].join("&")}" rel="stylesheet">
    `;
}

export function getExtensionWebviewContent(extensionPath: string, webview: vscode.Webview) {
  return /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta
              http-equiv="Content-Security-Policy"
              content=${getMetaContentAttr(webview)};
            />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            ${getFonts()}

            <style>
              @font-face {
                font-family: iconfont-preview;
              }

              html,
              body {
                display: flex;
                flex-direction: column;
                flex: 1;
                padding: 0;
              }

              #root {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                flex: 1;
                padding: 0;
                margin: 0 20px;
              }
            </style>
            <link rel="stylesheet" href="${webview.asWebviewUri(
              vscode.Uri.file(path.join(extensionPath, "dist", "preview.css"))
            )}" />
          </head>
          <script>
            exports = {};
          </script>
          <script src="${webview.asWebviewUri(
            vscode.Uri.file(path.join(extensionPath, "dist", "preview.js"))
          )}" defer >
          </script>
          <body></body>
        </html>
`;
}

export function getExtensionWebviewErrorContent(webview: vscode.Webview, error: Error) {
  return /*html*/ `
    <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta
              http-equiv="Content-Security-Policy"
              content=${getMetaContentAttr(webview)};
            />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            ${getFonts()}

            <style>
              body {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 0 !important;
                margin: 0 30px;
              }

              h1 {
                font-family: 'Ubuntu', sans-serif;
                font-weight: 300;
                font-size: 3rem;
                text-align: center;
                margin: 20px 0 10px 0;
              }

              h2 {
                font-family: 'Nunito', sans-serif;
                font-weight: 200;
                font-size: 2em;
                text-align: center;
              }

              #page {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 100%;
                background-color: #161616;
                margin: 0 20px;
              }

              #error-header {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                margin-bottom: 20px;
              }

              #error-content {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 90%;
              }

              .error-info {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 100%;
                margin: 15px;
              }

              .error-message-title {
                font-family: 'Work Sans', sans-serif;
                font-size: 1.7em;
                font-weight: 400;
                color: #cccccc;
                margin: 0 0 8px 0;
              }

              .error-message {
                font-family: 'Raleway', monospace;
                font-size: 1.3em;
                font-weight: 400;
                color: #ff5858;
              }

              .error-stack-title {
                font-family: 'Work Sans', sans-serif;
                font-size: 1.5em;
                font-weight: 400;
                color: #cccccc;
                margin: 0 0 8px 0;
              }

              .error-stack-code {
                font-family: 'Lato', sans-serif;
                font-size: 1em;
                font-weight: 500;
                line-height: 2;
                color: #ff5858;
              }

              </style>
          </head>
          <body>
            <div id="page">
              <div id="error-header">
                <h1>Failed to load preview.</h1>
                <h2>An error occurred while rendering the font preview.</h2>
              </div>
              <div id="error-content">
                <div class="error-info">
                  <h3 class="error-message-title">Error</h3>
                  <div class="error-message">${error.message}</div>
                </div >
                <div class="error-info">
                  <h3 class="error-stack-title">Stack</h3>
                  <code class="error-stack-code">
                    ${error.stack}
                  </code>
                </div>
              </div>
          </div>
          </body>
        `;
}

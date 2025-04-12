import path from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import TsconfigPathsWebpackPlugin from "tsconfig-paths-webpack-plugin";
import { Configuration } from "webpack";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import TerserWebpackPlugin from "terser-webpack-plugin";

export default {
  target: "web",
  devtool: "source-map",
  stats: "errors-warnings",
  entry: {
    extension: {
      import: "./src/extension.ts",
      filename: "extension.js"
    },
    preview: {
      import: "./src/webview/index.tsx",
      filename: "webview.js"
    }
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "dist"),
    libraryTarget: "commonjs"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    plugins: [new TsconfigPathsWebpackPlugin()],
    fallback: {
      path: require.resolve("path-browserify"),
      fs: false,
      module: false
    },
    alias: {
      styles: path.resolve(__dirname, "src/webview/styles")
    }
  },
  module: {
    rules: [
      {
        test: /[ts]x?$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true
        },
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({ verbose: true }),
    new ForkTsCheckerWebpackPlugin({
      typescript: { configFile: path.resolve(__dirname, "tsconfig.json") }
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false
          }
        }
      })
    ]
  },
  watchOptions: {
    poll: 1000
  },
  externals: {
    vscode: "commonjs vscode"
  }
} satisfies Configuration;

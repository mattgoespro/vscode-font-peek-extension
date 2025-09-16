import path from "path";
import TsconfigPathsWebpackPlugin from "tsconfig-paths-webpack-plugin";
import { Configuration } from "webpack";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import TerserWebpackPlugin from "terser-webpack-plugin";

export default {
  target: "web",
  devtool: "inline-source-map",
  stats: "errors-warnings",
  cache: true,
  entry: {
    extension: {
      import: "./src/extension/index.ts",
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
    libraryTarget: "commonjs",
    clean: true
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    plugins: [new TsconfigPathsWebpackPlugin()],
    fallback: {
      path: require.resolve("path-browserify"),
      fs: false,
      module: false
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx$/,
        loader: "esbuild-loader",
        exclude: /node_modules/,
        options: {
          loader: "tsx",
          target: "es2015"
        }
      },
      {
        test: /\.ts$/,
        loader: "esbuild-loader",
        exclude: /node_modules/,
        options: {
          loader: "ts",
          target: "es2015"
        }
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        exclude: /node_modules/
      }
    ]
  },
  plugins: [new ForkTsCheckerWebpackPlugin()],
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

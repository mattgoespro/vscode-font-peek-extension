import path from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import MiniCssExtractWebpackPlugin from "mini-css-extract-plugin";
import TsconfigPathsWebpackPlugin from "tsconfig-paths-webpack-plugin";
import { Configuration } from "webpack";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import TerserWebpackPlugin from "terser-webpack-plugin";
import sass from "sass";

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
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractWebpackPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]___[hash:base64:5]"
              }
            }
          },
          {
            loader: "sass-loader",
            options: {
              implementation: sass,
              sassOptions: {
                includePaths: [path.resolve(__dirname, "src/webview/styles")]
              }
            }
          },
          "postcss-loader"
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractWebpackPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[name]__[local]___[hash:base64:5]"
              }
            }
          },
          "postcss-loader"
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({ verbose: true }),
    new MiniCssExtractWebpackPlugin({
      filename: "webview.css",
      chunkFilename: "webview.css"
    }),
    new ForkTsCheckerWebpackPlugin({
      formatter: "basic",
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

import path from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import MiniCssExtractWebpackPlugin from "mini-css-extract-plugin";
import TsconfigPathsWebpackPlugin from "tsconfig-paths-webpack-plugin";
import { Configuration } from "webpack";
import { BundleAnalyzerPlugin as BundleAnalyzerWebpackPlugin } from "webpack-bundle-analyzer";

export default {
  target: "web",
  stats: "errors-warnings",
  entry: {
    extension: {
      import: "./src/extension.ts",
      filename: "extension.js"
    },
    preview: {
      import: "./src/preview/preview.tsx",
      filename: "preview.js"
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
      path: require.resolve("path-browserify")
    }
  },
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                ["@babel/preset-env", { modules: "commonjs" }],
                "@babel/preset-typescript",
                [
                  "@babel/preset-react",
                  {
                    runtime: "automatic"
                  }
                ]
              ],
              plugins: [
                "@babel/plugin-transform-runtime",
                "babel-plugin-react-css-modules",
                "@babel/plugin-transform-class-properties"
              ],
              cacheDirectory: true,
              cacheCompression: false,
              compact: false
            }
          }
        ],
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
            options: { modules: true }
          },
          "sass-loader",
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
            options: { modules: true }
          },
          ,
          "postcss-loader"
        ],
        exclude: /node_modules/
      }
    ]
  },
  externals: {
    vscode: "commonjs vscode"
  },
  plugins: [
    new MiniCssExtractWebpackPlugin({
      filename: "[name].css",
      chunkFilename: "[name].css"
    }),
    new CleanWebpackPlugin({ verbose: true })
  ]
} satisfies Configuration;

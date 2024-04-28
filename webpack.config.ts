import path from "path";
import { Configuration } from "webpack";
import TsconfigPathsWebpackPlugin from "tsconfig-paths-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

const config: Configuration = {
  target: "web",
  devtool: "inline-source-map",
  mode: "development",
  entry: {
    extension: {
      import: "./src/extension.ts",
      filename: "extension.js"
    },
    preview: {
      import: "./src/preview/index.tsx",
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
  optimization: {
    minimize: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { modules: "commonjs" }]],
            plugins: ["@babel/plugin-transform-runtime"],
            cacheDirectory: true,
            cacheCompression: false,
            compact: false
          }
        },
        exclude: /(node_modules\/(?!fonteditor-core))|(dist)/
      },
      {
        test: /\.tsx?$/,
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
        include: path.resolve(__dirname, "src"),
        exclude: /(node_modules)|(dist)/
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[local]",
                exportLocalsConvention: "camelCaseOnly"
              }
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  externals: {
    vscode: "commonjs vscode"
  },
  plugins: [
    new CleanWebpackPlugin({ verbose: true }),
    new ForkTsCheckerWebpackPlugin({ formatter: "basic" }),
    new HtmlWebpackPlugin({
      template: "./src/preview/index.html",
      filename: "preview.html",
      chunks: ["preview"],
      inject: "head"
    }),
    new MiniCssExtractPlugin({
      chunkFilename: "[id].css"
    })
  ]
};

export default config;

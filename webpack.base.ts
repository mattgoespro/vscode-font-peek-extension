import path from "path";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
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
      import: "./src/preview/Preview.tsx",
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
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              cacheCompression: true
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
    new CleanWebpackPlugin({ verbose: true }),
    new BundleAnalyzerWebpackPlugin({
      analyzerMode: "static",
      openAnalyzer: false,
      reportFilename: "bundle-report.html",
      defaultSizes: "stat",
      excludeAssets: [/\.(map|txt|html)$/]
    })
  ]
} satisfies Configuration;

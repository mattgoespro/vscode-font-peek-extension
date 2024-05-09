import path from "path";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { Configuration } from "webpack";
import { BundleAnalyzerPlugin as BundleAnalyzerWebpackPlugin } from "webpack-bundle-analyzer";
import { merge } from "webpack-merge";
import baseConfig from "./webpack.base";

export default merge<Configuration>(baseConfig, {
  mode: "development",
  devtool: "inline-source-map",
  optimization: {
    minimize: false
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: { configFile: path.resolve(__dirname, "tsconfig.json") },
      formatter: "basic"
    }),
    new BundleAnalyzerWebpackPlugin({
      analyzerMode: "static",
      openAnalyzer: false,
      reportFilename: "bundle-report.html",
      defaultSizes: "stat",
      excludeAssets: [/\.(map|txt|html)$/]
    })
  ]
} satisfies Configuration);

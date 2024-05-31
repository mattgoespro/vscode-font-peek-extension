import { Configuration } from "webpack";
import { merge } from "webpack-merge";
import baseConfig from "./webpack.base";

export default merge<Configuration>(baseConfig, {
  mode: "production",
  devtool: "cheap-source-map",
  optimization: {
    minimize: true
  },
  plugins: []
});

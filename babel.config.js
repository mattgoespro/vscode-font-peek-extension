console.log("\nbabel-loader: transpiling with babel\n");

/** @type {import('@babel/core').TransformOptions} */
export default {
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
  compact: "auto"
};

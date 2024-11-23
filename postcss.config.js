const path = require("path");

module.exports = {
  syntax: "postcss-scss",
  parser: "postcss-scss",
  plugins: [require("postcss-preset-env")]
};

/** @type {import("stylelint").Config} */
module.exports = {
  extends: ["stylelint-config-standard", "stylelint-config-standard-scss"],
  rules: {
    "declaration-property-unit-allowed-list": {
      "/^border/": ["px"],
      "/^margin|^padding|^gap/": ["%", "rem"],
      "/^font-size/": ["em"],
      "^[(min|max)-]width|^[(min|max)-]height": ["%", "rem"]
    },
    "unit-allowed-list": ["px", "rem", "fr", "%", "em", "s", "ms", "deg"]
  },
  overrides: [
    {
      files: ["**/*.scss"],
      customSyntax: "postcss-scss"
    }
  ]
};

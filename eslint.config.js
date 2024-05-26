const js = require("@eslint/js");
const htmlPlugin = require("@html-eslint/eslint-plugin");
const htmlParser = require("@html-eslint/parser");
const ts = require("typescript-eslint");
const prettierPlugin = require("eslint-config-prettier");
const importPlugin = require("eslint-plugin-import");
const reactPlugin = require("eslint-plugin-react");

/** @type { import("eslint").Linter.FlatConfig[]} */
module.exports = [
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    languageOptions: {
      parser: ts.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      }
    },
    plugins: {
      eslint: js,
      "typescript-eslint": ts,
      react: reactPlugin,
      import: importPlugin,
      prettier: prettierPlugin
    },
    ignores: ["node_modules/**/*", "dist/**/*"],
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts"]
      },
      "import/extensions": [".js", ".ts", ".tsx", ".html"],
      "import/order": ["error"],
      typescript: {
        alwaysTryTypes: true,
        project: ["./tsconfig.json"]
      }
    },
    rules: {
      ...ts.configs["eslint-recommended"].rules,
      ...ts.configs["recommended"].rules,
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true }
      ],
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "type", "parent", "sibling"],
          warnOnUnassignedImports: true,
          "newlines-between": "never",
          alphabetize: {
            order: "asc",
            orderImportKind: "asc"
          }
        }
      ]
    },
    ignores: ["node_modules", "dist"]
  },
  ...ts.configs.eslintRecommended,
  ...ts.configs.recommended,
  ...reactPlugin.configs.all,
  {
    ...htmlPlugin.configs["flat/recommended"],
    files: ["*.html"],
    ignores: ["node_modules", "dist"],
    languageOptions: {
      parser: htmlParser
    },
    plugins: {
      "@html-eslint": htmlPlugin,
      prettier: prettierPlugin
    },
    rules: {
      "@html-eslint/indent": ["error", 2]
    }
  }
];

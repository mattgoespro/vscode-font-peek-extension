/** @type { import("eslint").Linter.Config} */
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  extends: [
    "eslint:recommended",
    "prettier",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:@html-eslint/recommended"
  ],
  plugins: ["react", "@html-eslint"],
  settings: {
    react: {
      version: "detect"
    },
    "import/resolver": {
      node: {
        extensions: [".ts", ".tsx", ".js", ".html"]
      },
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json"
      },
      webpack: {
        config: "./webpack.base.ts"
      }
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts"]
    },
    "import/extensions": [".js", ".ts", ".tsx", ".html"],
    "import/order": ["error"]
  },
  rules: {
    "@html-eslint/indent": ["error", 2],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true }
    ],
    "react-hooks/exhaustive-deps": "off",
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
  ignorePatterns: ["*eslint*", "node_modules/**/*", "dist/**/*", "*.html"]
};

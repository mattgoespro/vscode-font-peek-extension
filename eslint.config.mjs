import typescriptEslint from "typescript-eslint";
import reactEslint from "eslint-plugin-react";
import htmlEslint from "@html-eslint/eslint-plugin";
import eslintPrettier from "eslint-config-prettier";
import eslintNode from "eslint-plugin-n";

export default typescriptEslint.config(
  {
    ignores: ["node_modules", "dist/**/*", "temp"],
    files: ["src"],
    settings: {
      ecmaFeatures: {
        jsx: true
      }
    }
  },
  ...typescriptEslint.configs.recommended,
  {
    ...typescriptEslint.configs.eslintRecommended,
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_"
        }
      ]
    }
  },
  {
    ...reactEslint.configs.flat.recommended,
    settings: {
      react: { version: "detect" }
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off"
    }
  },
  eslintPrettier,
  {
    ...eslintNode.configs["flat/recommended-module"],
    settings: {
      node: {
        tryExtensions: [".ts", ".tsx", ".js", ".jsx"]
      }
    },
    rules: {
      "n/no-unpublished-import": [
        "warn",
        {
          allowModules: [
            "typescript-eslint",
            "eslint-plugin-react",
            "@html-eslint/eslint-plugin",
            "eslint-config-prettier",
            "eslint-plugin-n"
          ]
        }
      ]
    }
  },
  // eslintNode.configs.recommended,
  { files: ["*.html"], ...htmlEslint.configs["flat/recommended"] }
);

import tseslint from "typescript-eslint";
import eslint from "@eslint/js";
import react from "eslint-plugin-react";
import html from "@html-eslint/eslint-plugin";

export default tseslint.config(
  {
    ignores: ["build/**/*", "node_modules/**/*", "temp/**/*"]
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
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
    files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    ...react.configs.flat.recommended,
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions
    },
    settings: {
      react: {
        version: "detect"
      },
      ecmaFeatures: {
        jsx: true
      }
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off"
    }
  },
  {
    files: ["*.html"],
    ...html.configs["flat/recommended"]
  }
);

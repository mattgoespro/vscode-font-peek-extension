import tsEslint from "typescript-eslint";
import eslint from "@eslint/js";
import reactEslint from "eslint-plugin-react";
import htmlEslint from "@html-eslint/eslint-plugin";

export default tsEslint.config(
  {
    ignores: ["node_modules", "dist", "temp", "*.js"]
  },
  eslint.configs.recommended,
  tsEslint.configs.recommended,
  {
    ...reactEslint.configs.flat.recommended,
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      ...reactEslint.configs.flat.recommended.languageOptions
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
      "react/jsx-uses-react": "off",
      "no-unused-vars": "off"
    }
  },
  {
    files: ["*.html"],
    ...htmlEslint.configs["flat/recommended"]
  }
);

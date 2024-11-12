import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import html from "@html-eslint/eslint-plugin";

export default tseslint.config(
  {
    ...react.configs.flat.recommended,
    ignores: ["node_modules", "dist/**/*", "temp"],
    files: ["src/**/*.{ts,tsx}"],
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
      "react/jsx-uses-react": "off",
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
  ...tseslint.configs.eslintRecommended,
  {
    files: ["*.html"],
    ...html.configs["flat/recommended"]
  }
);

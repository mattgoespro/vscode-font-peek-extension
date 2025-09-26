import tsEslint from "typescript-eslint";
import eslint from "@eslint/js";
import reactEslint from "eslint-plugin-react";
import jsxEslint from "eslint-plugin-jsx-a11y";
import htmlEslint from "@html-eslint/eslint-plugin";

export default tsEslint.config(
  {
    ignores: ["node_modules/**", "dist/**", "temp/**", "*.js", "**/*.d.ts"]
  },
  eslint.configs.recommended,
  tsEslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ]
    }
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    ...reactEslint.configs.flat.recommended,
    settings: { react: { version: "detect" } },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "no-unused-vars": "off"
    }
  },
  {
    files: ["src/**/*.tsx"],
    ...jsxEslint.flatConfigs.recommended,
    rules: {
      "jsx-a11y/anchor-is-valid": "warn"
    }
  },
  {
    files: ["*.html"],
    ...htmlEslint.configs["flat/recommended"]
  }
);

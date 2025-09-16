import tsEslint from "typescript-eslint";
import eslint from "@eslint/js";
import reactEslint from "eslint-plugin-react";
import jsxEslint from "eslint-plugin-jsx-a11y";
import htmlEslint from "@html-eslint/eslint-plugin";
import prettierConfigEslint from "eslint-config-prettier";

export default tsEslint.config(
  {
    ignores: ["node_modules", "dist", "temp", "*.js"]
  },
  eslint.configs.recommended,
  tsEslint.configs.recommended,
  {
    rules: {
      ...prettierConfigEslint.rules,
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ]
    }
  },
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
  { ...jsxEslint.flatConfigs.recommended },
  {
    files: ["*.html"],
    ...htmlEslint.configs["flat/recommended"]
  }
);

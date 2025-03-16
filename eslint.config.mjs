import eslintPrettier from "eslint-config-prettier";
import eslintReact from "eslint-plugin-react";
import eslintReactHooks from "eslint-plugin-react-hooks";
import eslintTs from "typescript-eslint";

export default eslintTs.config(
  {
    files: ["libs"]
  },
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
    ignores: ["node_modules", "dist", "temp"]
  },
  eslintTs.configs.recommended,
  eslintPrettier,
  eslintReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: "detect"
      }
    }
  },
  eslintReact.configs.flat["jsx-runtime"],
  eslintReactHooks.configs["recommended-latest"]
);

import tseslint from "typescript-eslint";
import eslint from "@eslint/js";

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
  }
);

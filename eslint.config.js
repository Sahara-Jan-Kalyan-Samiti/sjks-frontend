import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import globals from "globals";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: [".next", "node_modules", "out", "next-env.d.ts"] },
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { "react-hooks": reactHooks, "@next/next": nextPlugin, "jsx-a11y": jsxA11y },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      // images are fixed files in /public that CSS sizes and crops; they are shown with a plain <img> on purpose
      "@next/next/no-img-element": "off",
      // Pages Router only (this site uses the App Router) and it crashes on ESLint 9
      "@next/next/no-duplicate-head": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-empty": ["error", { allowEmptyCatch: true }]
    }
  },
  {
    // Full-screen viewers: the dark backdrop closes on click as a mouse convenience; keyboard users have the Close button and Escape (and arrow keys)
    files: ["src/components/sections/Gallery.tsx", "src/features/about/Awards.tsx", "src/features/media/Media.tsx"],
    rules: {
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/no-noninteractive-element-interactions": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      // focus moves to the Close button when the viewer opens, as dialogs should
      "jsx-a11y/no-autofocus": "off"
    }
  },
  {
    // Scrolling carousels and hover cards must be reachable with the keyboard, so these containers are focusable on purpose
    files: ["src/features/home/ImpactShowcase.tsx", "src/features/home/ProjectSlider.tsx", "src/features/home/Testimonials.tsx"],
    rules: { "jsx-a11y/no-noninteractive-tabindex": "off" }
  }
);

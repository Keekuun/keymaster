/** 根 ESLint 配置，供 monorepo 中各包复用。 */

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  ignorePatterns: ["dist/", "node_modules/", "apps/keymaster-docs/.vitepress/cache"],
  rules: {
    "no-console": "warn"
  }
};



/* eslint-disable-next-line n/no-commonjs */
const globals = require("globals");
const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const prettierPlugin = require("eslint-plugin-prettier");

// Filter out any globals with whitespace
const filterGlobals = (obj) => {
  if (!obj) return {};
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !/^\s|\s$/.test(key)),
  );
};

module.exports = [
  {
    files: ["src/**/*.{js,jsx}"],
    ignores: ["**/*.test.js", "**/*.spec.js"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      prettier: prettierPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        ...filterGlobals(globals.browser),
        ...filterGlobals(globals.es2021),
        process: true,
        require: true,
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "warn",
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^(React|_.*)$" },
      ],
      "prettier/prettier": "warn",
      "no-console": "warn",
    },
    settings: { react: { version: "detect" } },
  },
  {
    files: ["**/*.test.js", "**/*.spec.js"],
    plugins: { react: reactPlugin },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        ...filterGlobals(globals.browser),
        ...filterGlobals(globals.jest),
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^(React|_.*)$" },
      ],
    },
    settings: { react: { version: "detect" } },
  },
  {
    files: ["server/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...filterGlobals(globals.node),
        ...filterGlobals(globals.es2021),
      },
    },
    rules: {
      "no-console": "off",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["*.config.{js,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...filterGlobals(globals.node),
        ...filterGlobals(globals.es2021),
      },
    },
  },
];

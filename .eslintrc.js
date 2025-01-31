module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "prettier"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "warn",
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "prettier/prettier": "warn",
    "no-console": "warn",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  overrides: [
    {
      files: ["server/**/*.js"],
      env: {
        browser: false,
        node: true,
      },
      rules: {
        "no-console": "off",
      },
    },
  ],
};

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser', // Tells ESLint to use the installed parser package @typescript-eslint/parser. Allows ESLint to understand TypeScript syntax.
  plugins: [
    '@typescript-eslint', // Tells ESLint to load the installed plugin package @typescript-eslint/eslint-plugin. This allows you to use the rules within your codebase
  ],
  extends: [
    'eslint:recommended', // ESLint's inbuilt "recommended" config - it turns on a small, sensible set of rules which lint for well-known best-practices.
    "plugin:react/recommended", // Uses the recommended rules from @eslint-plugin-react
    'plugin:@typescript-eslint/eslint-recommended', // A configuration by @typescript-eslint which disables a few of the recommended rules from the previous set that we know are already covered by TypeScript's typechecker.
    'plugin:@typescript-eslint/recommended', // is @typescript-eslint's "recommended" config - it's just like eslint:recommended, except it only turns on rules from our TypeScript-specific plugin.
    'prettier/@typescript-eslint',  // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended',  // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions: {
    ecmaVersion: 2018,  // Allows for the parsing of modern ECMAScript features
    sourceType: 'module',  // Allows for the use of imports
    ecmaFeatures: {
      jsx: true,  // Allows for the parsing of JSX
    },
  },
  settings: {
    react: {
      version: 'detect',  // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
  },
  env: {
    es6: true,
    browser: true,
    node: true,
  },
};
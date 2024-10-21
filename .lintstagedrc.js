export default {
  "*.{js,ts,tsx}": ["prettier --write", "eslint --fix"],
  "*.{less,css}": ["prettier --write", "stylelint --fix"],
};

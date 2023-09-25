"use strict";

module.exports = {
  "*.{js,jsx,ts,tsx}": ["prettier --write", "eslint --fix"],
  "*.{less,css}": ["prettier --write", "stylelint --fix"],
};

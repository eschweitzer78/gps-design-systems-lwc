const { jestConfig } = require("@salesforce/sfdx-lwc-jest/config");
const ro = require("resize-observer-polyfill");

const setupFilesAfterEnv = jestConfig.setupFilesAfterEnv || [];
setupFilesAfterEnv.push("<rootDir>/jest-sa11y-setup.js");
setupFilesAfterEnv.push("<rootDir>/jest-CSS-setup.js");

module.exports = {
  ...jestConfig,
  verbose: true,
  modulePathIgnorePatterns: ["<rootDir>/.localdevserver", "sfGpsTemp"],
  setupFilesAfterEnv,
  moduleFileExtensions: ["js", "html", "css"],
  transform: {
    "^.+\\.(js|html|css)$": "@lwc/jest-transformer"
  },
  moduleNameMapper: {
    "^@salesforce/apex$": "<rootDir>/__test__/jest-mocks/apex",
    "^@salesforce/community/(.*)": "<rootDir>/__test__/jest-mocks/community/$1",
    "^omnistudio/omniscriptBaseMixin$":
      "<rootDir>/__test__/jest-mocks/omnistudio/omniscriptBaseMixin",
    "^omnistudio/radioGroup$":
      "<rootDir>/__test__/jest-mocks/omnistudio/radioGroup",
    "^lightning/combobox$":
      "<rootDir>/__test__/jest-mocks/lightning/combobox/combobox",
    "^lightning/primitiveIcon$":
      "<rootDir>/__test__/jest-mocks/lightning/primitiveIcon/primitiveIcon",
    "^lightning/focusTrap$":
      "<rootDir>/__test__/jest-mocks/lightning/focusTrap/focusTrap",
    "^lightning/(.*)":
      "<rootDir>/node_modules/@salesforce/sfdx-lwc-jest/src/lightning-stubs/$1/$1"
  },
  globals: {
    ResizeObserver: ro
  }
};

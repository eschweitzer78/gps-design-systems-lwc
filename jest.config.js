const { jestConfig } = require("@salesforce/sfdx-lwc-jest/config");

const setupFilesAfterEnv = jestConfig.setupFilesAfterEnv || [];
setupFilesAfterEnv.push("<rootDir>/jest-sa11y-setup.js");

module.exports = {
  ...jestConfig,
  modulePathIgnorePatterns: ["<rootDir>/.localdevserver"],
  setupFilesAfterEnv,
  moduleFileExtensions: ["js", "html"],
  transform: {
    "^.+\\.(js|html|css)$": "@lwc/jest-transformer"
  },
  moduleNameMapper: {
    "^@salesforce/apex$": "<rootDir>/__test__/jest-mocks/apex",
    "^@salesforce/community/basePath$":
      "<rootDir>/__test__/jest-mocks/community/basePath",
    "^@salesforce/community/isGuest$":
      "<rootDir>/__test__/jest-mocks/community/isGuest",
    "^@salesforce/community/Id$": "<rootDir>/__test__/jest-mocks/community/Id",
    "^lightning/navigation$":
      "<rootDir>/__test__/jest-mocks/lightning/navigation",
    "^lightning/uiRecordApi$":
      "<rootDir>/__test__/jest-mocks/lightning/uiRecordApi",
    "^omnistudio/omniscriptBaseMixin$":
      "<rootDir>/__test__/jest-mocks/omnistudio/omniscriptBaseMixin",
    "^omnistudio/radioGroup$":
      "<rootDir>/__test__/jest-mocks/omnistudio/radioGroup"
  }
};

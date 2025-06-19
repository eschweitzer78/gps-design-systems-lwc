import { jestConfig } from "@salesforce/sfdx-lwc-jest/config.js";

const setupFilesAfterEnv = jestConfig.setupFilesAfterEnv || [];
setupFilesAfterEnv.push("<rootDir>/jest-CSS-setup.js");
setupFilesAfterEnv.push("<rootDir>/jest-matchers-setup.js");
setupFilesAfterEnv.push("<rootDir>/jest-resize-observer-setup.js");
setupFilesAfterEnv.push("<rootDir>/jest-sa11y-setup.js");

export default {
  ...jestConfig,
  moduleNameMapper: {
    "\\.(css)$": "<rootDir>/__test__/jest-mocks/css",
    "^@salesforce/apex$": "<rootDir>/__test__/jest-mocks/apex",
    "^@salesforce/community/(.*)": "<rootDir>/__test__/jest-mocks/community/$1",
    "^omnistudio/omniscriptBaseMixin$":
      "<rootDir>/__test__/jest-mocks/omnistudio/omniscriptBaseMixin",
    "^omnistudio/pubsub$": "<rootDir>/__test__/jest-mocks/omnistudio/pubsub",
    "^omnistudio/radioGroup$":
      "<rootDir>/__test__/jest-mocks/omnistudio/radioGroup",
    "^omnistudio/salesforceUtils$":
      "<rootDir>/__test__/jest-mocks/omnistudio/salesforceUtils",
    "^omnistudio/utility$": "<rootDir>/__test__/jest-mocks/omnistudio/utility",
    "^lightning/combobox$":
      "<rootDir>/__test__/jest-mocks/lightning/combobox/combobox",
    "^lightning/primitiveIcon$":
      "<rootDir>/__test__/jest-mocks/lightning/primitiveIcon/primitiveIcon",
    "^lightning/focusTrap$":
      "<rootDir>/__test__/jest-mocks/lightning/focusTrap/focusTrap",
    "^lightning/(.*)":
      "<rootDir>/node_modules/@salesforce/sfdx-lwc-jest/src/lightning-stubs/$1/$1"
  },
  modulePathIgnorePatterns: [
    "<rootDir>/.localdevserver",
    "sfGpsTemp",
    "fixtures",
    "sfGpsDsAuNswFull",
    "sfGpsDsAuNswSFull",
    "sfGpsDsAuQldFull",
    "sfGpsDsAuVic2Full",
    "sfGpsDsFrGovFull",
    "sfGpsDsUkGovFull"
  ],
  setupFiles: ["jest-canvas-mock"],
  setupFilesAfterEnv,
  verbose: true
};

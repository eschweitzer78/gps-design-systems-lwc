/*
 * Copyright (c) 2023 Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

const ERROR_PROP_NAMES = [
  "messageWhenValueMissing",
  "messageWhenTooShort",
  "messageWhenTooLong",
  "messageWhenBadInput",
  "messageWhenRangeOverflow",
  "messageWhenRangeUnderflow",
  "messageWhenStepMismatch",
  "messageWhenTypeMismatch",
  "messageWhenMaskIncomplete"
];

let SfGpsDsOmniErrorMsgConfigMixin = (base) =>
  class extends base {
    initCompVariables() {
      super.initCompVariables();

      // Note: messageWhenPatternMismatch is already configurable through the ptrnErrText prop */
      ERROR_PROP_NAMES.forEach((item) => {
        let propSetValValue = this._propSetMap[item];
        if (propSetValValue) {
          this[`_${item}`] = propSetValValue;
        }
      });
    }
  };

export default SfGpsDsOmniErrorMsgConfigMixin;

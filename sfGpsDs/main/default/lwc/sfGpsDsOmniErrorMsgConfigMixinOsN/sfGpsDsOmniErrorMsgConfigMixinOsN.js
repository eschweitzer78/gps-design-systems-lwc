/*
 * Copyright (c) 2023 Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

let SfGpsDsOmniErrorMsgConfigMixin = (base) =>
  class extends base {
    get sfGpsDsMessageWhenValueMissing() {
      return (
        this._propSetMap.messageWhenValueMissing ||
        this._messageWhenValueMissing
      );
    }

    get sfGpsDsMessageWhenPatternMismatch() {
      return (
        this._propSetMap.messageWhenPatternMismatch ||
        this._messageWhenPatternMismatch
      );
    }

    get sfGpsDsMessageWhenTooShort() {
      return this._propSetMap.messageWhenTooShort || this._messageWhenTooShort;
    }

    get sfGpsDsMessageWhenTooLong() {
      return this._propSetMap.messageWhenTooLong || this._messageWhenTooLong;
    }

    get sfGpsDsMessageWhenBadInput() {
      return this._propSetMap.messageWhenBadInput || this._messageWhenBadInput;
    }

    get sfGpsDsMessageWhenRangeOverflow() {
      return (
        this._propSetMap.messageWhenRangeOverflow ||
        this._messageWhenRangeOverflow
      );
    }

    get sfGpsDsMessageWhenRangeUnderflow() {
      return (
        this._propSetMap.messageWhenRangeUnderflow ||
        this._messageWhenRangeUnderflow
      );
    }

    get sfGpsDsMessageWhenStepMismatch() {
      return (
        this._propSetMap.messageWhenStepMismatch ||
        this._messageWhenStepMismatch
      );
    }

    get sfGpsDsMessageWhenTypeMismatch() {
      return (
        this._propSetMap.messageWhenTypeMismatch ||
        this._messageWhenTypeMismatch
      );
    }

    get sfGpsDsMessageWhenMaskIncomplete() {
      return (
        this._propSetMap.messageWhenMaskIncomplete ||
        this._messageWhenMaskIncomplete
      );
    }
  };

export default SfGpsDsOmniErrorMsgConfigMixin;

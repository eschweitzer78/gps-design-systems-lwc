/*
 * Copyright (c) 2023, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import OmniscriptUrl from "omnistudio/omniscriptUrl";
import SfGpsDsOmniHasValidationMixin from "c/sfGpsDsOmniHasValidationMixinOsN";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";

/* replacement pattern for URL as original does not perform well IMHO */
const PATTERN =
  "^[Hh][Tt][Tt][Pp][Ss]?:\\/\\/(?:(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-zA-Z\\u00a1-\\uffff0-9]+-?)*[a-zA-Z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-zA-Z\\u00a1-\\uffff]{2,}))(?::\\d{2,5})?(?:\\/[^\\s]*)?";

export default class extends SfGpsDsOmniHasValidationMixin(OmniscriptUrl) {
  /* computed */

  get sfGpsDsUrlPattern() {
    return PATTERN;
  }

  get mergedLabel() {
    return omniGetMergedField(this, this._propSetMap.label);
  }

  get mergedHelpText() {
    return omniGetMergedField(this, this._handleHelpText);
  }

  get mergedPlaceholder() {
    return omniGetMergedField(this, this._placeholder);
  }

  get mergedMessageWhenValueMissing() {
    return omniGetMergedField(this, this._messageWhenValueMissing);
  }

  get mergedMessageWhenPatternMismatch() {
    return omniGetMergedField(this, this._messageWhenPatternMismatch);
  }

  get mergedMessageWhenTooShort() {
    return omniGetMergedField(this, this._messageWhenTooShort);
  }

  get mergedMessageWhenTooLong() {
    return omniGetMergedField(this, this._messageWhenTooLong);
  }

  get mergedMessageWhenBadInput() {
    return omniGetMergedField(this, this._messageWhenBadInput);
  }

  get mergedMessageWhenRangeOverflow() {
    return omniGetMergedField(this, this._messageWhenRangeOverflow);
  }

  get mergedMessageWhenRangeUnderflow() {
    return omniGetMergedField(this, this._messageWhenRangeUnderflow);
  }

  get mergedMessageWhenStepMismatch() {
    return omniGetMergedField(this, this._messageWhenStepMismatch);
  }

  get mergedMessageWhenTypeMismatch() {
    return omniGetMergedField(this, this._messageWhenTypeMismatch);
  }
}

/*
 * Copyright (c) 2024, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { computeClass } from "c/sfGpsDsHelpersOs";
import sfGpsDsAuQldStaticResource from "@salesforce/resourceUrl/sfGpsDsAuQld";

const I18N = {
  optional: "(Optional)",
  errorAriaLabel: "Error: "
};

const SfGpsAuQldStatusHelperMixin = (base) =>
  class extends base {
    get i18n() {
      return I18N;
    }

    get computedStatusErrorIconHref() {
      return (
        sfGpsDsAuQldStaticResource +
        "/assets/img/QGDS-icons-v2.svg#icon-Status-Error"
      );
    }

    get _errorMessage() {
      return this.sfGpsDsErrorMessage?.trim();
    }

    get computedAriaInvalid() {
      return this.sfGpsDsIsError;
    }

    get computedIsDisabledOrReadOnly() {
      return this.disabled || this.readOnly;
    }

    get computedAriaDescribedBy() {
      return computeClass({
        helper: this.fieldLevelHelp,
        errorMessageBlock: this.sfGpsDsIsError
      });
    }
  };

export default SfGpsAuQldStatusHelperMixin;

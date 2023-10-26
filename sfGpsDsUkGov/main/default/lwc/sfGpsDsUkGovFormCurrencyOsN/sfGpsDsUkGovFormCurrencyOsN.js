/*
 * Copyright (c) 2023, Benedict Sefa Ziorklui, Emmanuel Schweitzer and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/* notes
      field-level-help-position={_propSetMap.helpTextPos} not supported
      required-label={allCustomLabelsUtil.OmniRequired} not suppported
      icon-name="utility:info" not supported
*/

import SfGpsDsFormCurrencyOsN from "c/sfGpsDsFormCurrencyOsN";
import SfGpsDsUkGovFormErrorMgtMixin from "c/sfGpsDsUkGovFormErrorMgtMixinOsN";
import tmpl from "./sfGpsDsUkGovFormCurrencyOsN.html";

export default class SfGpsDsUkGovFormCurrencyOsN extends SfGpsDsUkGovFormErrorMgtMixin(
  SfGpsDsFormCurrencyOsN
) {
  render() {
    return tmpl;
  }
}

import OmniscriptLookup from "omnistudio/omniscriptLookup";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";
import SfGpsDsUkGovLabelMixin from "c/sfGpsDsUkGovLabelMixinOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";

import tmpl from "./sfGpsDsUkGovFormLookupOsN.html";

export default class SfGpsDsUkGovFormLookupOsN extends SfGpsDsUkGovLabelMixin(
  OmniscriptLookup,
  "large"
) {
  render() {
    return tmpl;
  }

  get computedFormGroupClassName() {
    return computeClass({
      "govuk-form-group": true,
      "govuk-form-group--error": this.isError
    });
  }

  get computedLookUpInputError() {
    return computeClass({
      "govuk-input": true,
      lookup: true,
      "govuk-input--error": this.isError
    });
  }

  get computedAriaInvalid() {
    return this.isError;
  }

  get computedAriaDescribedBy() {
    return computeClass({
      helper: this._handleHelpText,
      errorMessageBlock: this.isError
    });
  }

  get mergedLabel() {
    return omniGetMergedField(this, this._propSetMap.label);
  }

  get mergedHelpText() {
    return omniGetMergedField(this, this._handleHelpText);
  }
}

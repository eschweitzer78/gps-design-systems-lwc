import OmniscriptLookup from "omnistudio/omniscriptLookup";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
import tmpl from "./sfGpsDsAuVicFormLookupOsN.html";

export default class SfGpsDsAuVicFormLookupOsN extends OmniscriptLookup {
  render() {
    return tmpl;
  }

  get computedFormGroupClassName() {
    return computeClass({
      "form-group": true,
      invalid: this.invalid,
      valid: !this.invalid,
      required: this._propSetMap.required
    });
  }

  get mergedLabel() {
    return omniGetMergedField(this, this._propSetMap.label);
  }

  get mergedHelpText() {
    return omniGetMergedField(this, this._handleHelpText);
  }
}

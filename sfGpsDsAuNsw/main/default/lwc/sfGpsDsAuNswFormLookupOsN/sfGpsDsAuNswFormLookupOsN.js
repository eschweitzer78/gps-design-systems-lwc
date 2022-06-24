import OmniscriptLookup from "omnistudio/omniscriptLookup";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";
import { getHelperClassName, getStatusIcon } from "c/sfGpsDsAuNswFormHelperOsN";
import tmpl from "./sfGpsDsAuNswFormLookupOsN.html";

export default class SfGpsDsAuNswFormLookupOsN extends OmniscriptLookup {
  render() {
    return tmpl;
  }

  get mergedLabel() {
    return omniGetMergedField(this, this._propSetMap.label);
  }

  get mergedHelpText() {
    return omniGetMergedField(this, this._handleHelpText);
  }

  get computedLabelClassName() {
    return `nsw-form__label ${this.required ? "nsw-form__required" : ""}`;
  }

  get computedHelperClassName() {
    return getHelperClassName("invalid");
  }

  get computedStatusIcon() {
    return getStatusIcon("invalid");
  }
}

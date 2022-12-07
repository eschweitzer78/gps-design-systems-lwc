import OmniscriptLookup from "omnistudio/omniscriptLookup";
import { omniGetMergedField } from "c/sfGpsDsOmniHelpersOsN";
import { getHelperClassName, getStatusIcon } from "c/sfGpsDsAuNswFormHelperOsN";
import { computeClass } from "c/sfGpsDsHelpersOs";
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
    return computeClass({
      "nsw-form__label": true,
      "nsw-form__required": this._propSetMap.required
    });
  }

  get computedHelperClassName() {
    return getHelperClassName("invalid");
  }

  get computedStatusIcon() {
    return getStatusIcon("invalid");
  }
}

/**
 * @module ns/omniscriptDisclosure
 * @description This component is used to render a Disclosure Element, it extends `OmniscriptCheckbox`.
 */
import OmniscriptCheckbox from "c/sfGpsDsOsrtOmniscriptCheckbox";
import { handleMergeField } from "c/sfGpsDsOsrtOmniscriptInternalUtils";
import { replaceUrlHost } from "c/sfGpsDsOsrtOmniscriptRestApi";
import tmpl from "./omniscriptDisclosure_slds.html";
import tmpl_nds from "./omniscriptDisclosure_nds.html";

/**
 * Default exported class OmniscriptDisclosure
 * @extends OmniscriptCheckbox
 * @typicalname OmniscriptDisclosure
 */
export default class OmniscriptDisclosure extends OmniscriptCheckbox {
  /**
   * @scope private
   * @description disclosure text
   */
  _dText;

  initCompVariables() {
    super.initCompVariables();
    let disclosureText = this.scriptHeaderDef.multiLang
      ? this._propSetMap.textKey
      : this._propSetMap.text;
    this._dText = handleMergeField(
      disclosureText,
      this.jsonData,
      this.scriptHeaderDef.labelMap,
      null
    );
    this._dText = replaceUrlHost(
      this._dText,
      this.scriptHeaderDef.isCommunity,
      this.scriptHeaderDef.networkUrlPathPrefix || null,
      this.scriptHeaderDef.communityBaseUrl
    );
  }

  /**
   * @scope private
   * @description Overwrites native render.
   * @returns {Template}
   */
  render() {
    return this.layout === "newport" ? tmpl_nds : tmpl;
  }
}

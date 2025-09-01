import OmniscriptBaseAction from "c/sfGpsDsOsrtOmniscriptBaseAction";
import { OmniscriptDrExtractActionUtil } from "c/sfGpsDsOsrtOmniscriptActionUtils";

/**
 * DataRaptor Extract Action for Omniscript
 */
export default class OmniscriptDrExtractAction extends OmniscriptBaseAction {
  /**
   * @scope private
   * @description Overwrites inherited connectedCallback. Instantiates specific action utility class from action
   *              framework.
   * @returns {Void}
   */
  connectedCallback() {
    super.connectedCallback();

    if (this.jsonDef) {
      this._actionUtilClass = new OmniscriptDrExtractActionUtil(this.jsonDef);
    }
  }
}

import OmniscriptBaseAction from "c/sfGpsDsOsrtOmniscriptBaseAction";
import { OmniscriptIpActionUtil } from "c/sfGpsDsOsrtOmniscriptActionUtils";

/**
 * Integration Procedure Action for Omniscript
 */
export default class OmniscriptIpAction extends OmniscriptBaseAction {
  /**
   * @scope private
   * @description Overwrites inherited connectedCallback. Instantiates specific action utility class from action
   *              framework.
   * @returns {Void}
   */
  connectedCallback() {
    super.connectedCallback();

    if (this.jsonDef) {
      this._actionUtilClass = new OmniscriptIpActionUtil(this.jsonDef);
    }
  }
}

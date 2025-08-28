/**
 * @module ns/OmniscriptEmailAction
 * @description This component is used to perform the email action in omniscript.
 */
import OmniscriptBaseAction from "c/sfGpsDsOsrtOmniscriptBaseAction";
import { OmniscriptEmailActionUtil } from "c/sfGpsDsOsrtOmniscriptActionUtils";
/**
 * Default exported class OmniscriptEmailAction.
 * @extends OmniscriptBaseAction
 * @typicalname OmniscriptEmailAction
 */
export default class OmniscriptEmailAction extends OmniscriptBaseAction {
  /**
   * @scope private
   * @description Overwrites inherited connectedCallback. Instantiates specific action utility class from action
   *              framework.
   * @returns {Void}
   */
  connectedCallback() {
    super.connectedCallback();

    if (this.jsonDef) {
      this._actionUtilClass = new OmniscriptEmailActionUtil(this.jsonDef);
    }
  }
}

/**
 * @module ns/omniscriptSetErrors
 * @description This component is used to perform Set Errors.
 */
import OmniscriptBaseAction from "c/sfGpsDsOsrtOmniscriptBaseAction";
import { OmniscriptSetErrorsUtil } from "c/sfGpsDsOsrtOmniscriptActionUtils";

/**
 * Default exported class OmniscriptSetErrors.
 * @extends OmniscriptBaseAction
 * @typicalname OmniscriptSetErrors
 */
export default class OmniscriptSetErrors extends OmniscriptBaseAction {
  /**
   * @scope private
   * @description Overwrites inherited connectedCallback. Instantiates specific action utility class from action
   *              framework.
   * @returns {Void}
   */
  connectedCallback() {
    super.connectedCallback();

    if (this.jsonDef) {
      this._actionUtilClass = new OmniscriptSetErrorsUtil(this.jsonDef);
    }
  }
}

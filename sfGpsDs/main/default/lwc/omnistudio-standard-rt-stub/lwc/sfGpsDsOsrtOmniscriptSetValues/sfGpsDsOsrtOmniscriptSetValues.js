/**
 * @module ns/omniscriptSetValues
 * @description This component is used to perform Set Values.
 */
import OmniscriptBaseAction from "c/sfGpsDsOsrtOmniscriptBaseAction";
import { OmniscriptSetValuesUtil } from "c/sfGpsDsOsrtOmniscriptActionUtils";

/**
 * Default exported class OmniscriptSetValues.
 * @extends OmniscriptBaseAction
 * @typicalname OmniscriptSetValues
 */
export default class OmniscriptSetValues extends OmniscriptBaseAction {
  /**
   * @scope private
   * @description Overwrites inherited connectedCallback. Instantiates specific action utility class from action
   *              framework.
   * @returns {Void}
   */
  connectedCallback() {
    super.connectedCallback();

    if (this.jsonDef) {
      this._actionUtilClass = new OmniscriptSetValuesUtil(this.jsonDef);
    }
  }

  /**
   * @scope private
   * @description Overwrites inherited skipValidation. Bypasses validation by default.
   * @returns {Boolean}
   */
  skipValidation() {
    return true;
  }
}

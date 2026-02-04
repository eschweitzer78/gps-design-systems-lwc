import OmniscriptBaseAction from "c/sfGpsDsOsrtOmniscriptBaseAction";
import { OmniscriptHttpActionUtil } from "c/sfGpsDsOsrtOmniscriptActionUtils";
import { sendHttpDataToDebugConsole } from "c/sfGpsDsOsrtOmniscriptInternalUtils";

/**
 * HTTP Action for Omniscript
 */
export default class OmniscriptHttpAction extends OmniscriptBaseAction {
  /**
   * @scope private
   * @description Overwrites inherited connectedCallback. Instantiates specific action utility class from action
   *              framework.
   * @returns {Void}
   */
  connectedCallback() {
    super.connectedCallback();

    if (this.jsonDef) {
      this._actionUtilClass = new OmniscriptHttpActionUtil(this.jsonDef);
    }
  }

  /**
   * @scope private
   * @description Overwrites inherited sendDataToDebugConsole. Sends data to the Debug Console event handler.
   * @param {Object} params
   * @param {Object} resp
   * @param {String} label
   * @returns {Void}
   */
  sendDataToDebugConsole(params, resp, label) {
    sendHttpDataToDebugConsole(
      this,
      params,
      resp,
      label,
      this.jsonDef,
      "omniactiondebug"
    );
  }
}

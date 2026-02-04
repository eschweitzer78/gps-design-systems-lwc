import OmniscriptBaseAction from "c/sfGpsDsOsrtOmniscriptBaseAction";
import { OmniscriptRemoteActionUtil } from "c/sfGpsDsOsrtOmniscriptActionUtils";

/**
 * Remote Action for Omniscript.
 */
export default class OmniscriptRemoteAction extends OmniscriptBaseAction {
  /**
   * @description Gets remote options. Overwrites inherited from OmniDesignerBaseActionPropertySet.
   */
  get _remoteOptions() {
    this._remoteOptionsArray = this.adaptObjectToKeyValue(
      this.propertySet.remoteOptions,
      this._remoteOptionsArray,
      ["preTransformBundle", "postTransformBundle"]
    );

    return this._remoteOptionsArray;
  }

  /**
   * @scope private
   * @description Overwrites inherited connectedCallback. Instantiates specific action utility class from action
   *              framework.
   * @returns {Void}
   */
  connectedCallback() {
    super.connectedCallback();

    if (this.jsonDef) {
      this._actionUtilClass = new OmniscriptRemoteActionUtil(this.jsonDef);
    }
  }
}

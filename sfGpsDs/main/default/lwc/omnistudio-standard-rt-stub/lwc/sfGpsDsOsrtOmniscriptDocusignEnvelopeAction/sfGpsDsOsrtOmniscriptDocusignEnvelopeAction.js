/**
 * @module ns/omniscriptDocusignEnvelopeAction
 * @description This component is used to send the Docusign Envelope docs on mail.
 */
import OmniscriptBaseAction from "c/sfGpsDsOsrtOmniscriptBaseAction";
import { OmniscriptDocusignEnvelopeActionUtil } from "c/sfGpsDsOsrtOmniscriptActionUtils";
/**
 * Default exported class OmniscriptDocusignEnvelopeAction.
 * @extends OmniscriptBaseAction
 * @typicalname OmniscriptDocusignEnvelopeAction
 */
export default class OmniscriptDocusignEnvelopeAction extends OmniscriptBaseAction {
  /**
   * @scope private
   * @description Overwrites inherited connectedCallback. Instantiates specific action utility class from action
   *              framework.
   * @returns {Void}
   */
  connectedCallback() {
    super.connectedCallback();

    if (this.jsonDef) {
      this._actionUtilClass = new OmniscriptDocusignEnvelopeActionUtil(
        this.jsonDef
      );
    }
  }
}

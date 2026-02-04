/**
 * @module ns/omniscriptDeleteAction
 * @description This component is used to perform Delete Action in omniscript.
 */
import { api } from "lwc";
import OmniscriptBaseAction from "c/sfGpsDsOsrtOmniscriptBaseAction";
import { OmniscriptDeleteActionUtil } from "c/sfGpsDsOsrtOmniscriptActionUtils";

/**
 * Default exported class OmniscriptDeleteAction.
 * @extends OmniscriptBaseAction
 * @typicalname OmniscriptDeleteAction
 */
export default class OmniscriptDeleteAction extends OmniscriptBaseAction {
  /**
   * @scope private
   * @description Overwrites inherited connectedCallback. Instantiates specific action utility class from action
   *              framework.
   * @returns {Void}
   */
  connectedCallback() {
    super.connectedCallback();

    if (this.jsonDef) {
      this._actionUtilClass = new OmniscriptDeleteActionUtil(this.jsonDef);
    }
  }

  /**
   * @scope public
   * @description Processes the logic for executing an action. This method is called from onclick attribute in
   *              component's HTML markup and in Header component.
   */
  // eslint-disable-next-line consistent-return
  @api execute() {
    if (this._propSetMap.confirm && this._isBtn) {
      /**
       * @type {ModalConfiguration}
       */
      const modalConfig = {
        type: "info",
        header: this._propSetMap.label,
        message: this._propSetMap.remoteConfirmMsg,
        buttons: [
          {
            label: this._propSetMap.cancelLabel,
            key: this._propSetMap.cancelLabel
          },
          {
            label: this._propSetMap.subLabel,
            key: this._propSetMap.subLabel,
            handleClick: () => super.execute()
          }
        ],
        closeAfterClick: true
      };

      this.dispatchOmniEventUtil(this, modalConfig, "omnimodal");
    } else {
      return super.execute();
    }
  }

  /**
   * @scope private
   * @description Additional handling of successful deletions.
   * @param {Object} resp
   * @param {Object} element
   * @returns {Void}
   */
  // eslint-disable-next-line no-unused-vars
  handleResponseSuccess(resp, element) {
    const modalDetails = {
      type: "success",
      message: element.propSetMap.entityIsDeletedMessage,
      header: this._propSetMap.label,
      buttons: [{ label: "Ok", key: "0-Ok" }],
      closeAfterClick: true
    };
    this.dispatchOmniEventUtil(this, modalDetails, "omnimodal");
  }
}

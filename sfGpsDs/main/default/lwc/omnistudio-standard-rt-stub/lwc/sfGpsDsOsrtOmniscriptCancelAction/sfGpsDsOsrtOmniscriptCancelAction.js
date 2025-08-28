import { api } from "lwc";
import OmniscriptNavigateAction from "c/sfGpsDsOsrtOmniscriptNavigateAction";

/**
 * Element that extends the OmniscriptNavigateAction and performs navigation away
 * from the omniscript. In the designer a cancel action is defined by adding a `Navigate Action` element
 * to the root level of the script, and giving it the name 'CANCEL'.
 * @module c/omniscriptCancelAction
 * @extends OmniscriptNavigateAction
 * @typicalname OmniscriptCancelAction
 */
export default class OmniscriptCancelAction extends OmniscriptNavigateAction {
  /**
   * Constant value returned when cancel succeeds.
   * @type {string}
   * @scope static
   */
  static CANCEL_RESOLVED = "CANCEL_RESOLVED";

  /**
   * Constant value returned when cancel default (inline) succeeds.
   * @type {string}
   * @scope static
   */
  static DEFAULT_CANCEL_RESOLVED = "DEFAULT_CANCEL_RESOLVED";

  /**
   * Constant value thrown when cancel is aborted.
   * @type {string}
   * @scope static
   */
  static CANCEL_ABORTED = "CANCEL_ABORTED";

  /**
   * Constant value thrown when cancel is disabled.
   * @type {string}
   * @scope static
   */
  static CANCEL_DISABLED = "CANCEL_DISABLED";

  /**
   * Execute the configured navigate action. Fired by omniscriptHeader.
   * @scope api (public)
   * @returns {Promise<any>}
   */
  @api cancel() {
    return Promise.resolve()
      .then(() => {
        if (this.jsonDef.propSetMap.showCancelPrompt)
          return OmniscriptCancelAction.cancelPrompt(
            this,
            this._propSetMap.cancelMessage,
            this.allCustomLabelsUtil
          );

        return OmniscriptCancelAction.CANCEL_RESOLVED;
      })
      .then((result) => this._navigateAction.navigate().then(() => result));
  }

  /**
   * Show the cancel modal confirm
   * @param {LightningElement} comp - Component used to fire the omni modal event. Should be a
   * omniscript-cancel-action, or navigate-action. Must be a child of the omni header in order for the header to recieve the event.
   * @param {string} [message] - Message to display in the modal confirm.
   * @param {string} [header] - Title of the modal confirm.
   * @scope static
   * @returns {Promise<any>}
   */
  static cancelPrompt(comp, message, labels) {
    message = message || comp.allCustomLabelsUtil.OmnicancelMessage;

    return new Promise((resolve, reject) => {
      /**
       * @type {ModalConfiguration}
       */
      const modalConfig = {
        type: "info",
        header: labels.OmnicancelHeader,
        message: message,
        closeAfterClick: true,
        buttons: [
          {
            label: labels.OmniReturn,
            key: "0-return",
            handleClick: () => {
              reject(OmniscriptCancelAction.CANCEL_ABORTED);
            }
          },
          {
            label: labels.OmniContinue,
            key: "1-continue",
            handleClick: () => {
              resolve(OmniscriptCancelAction.CANCEL_RESOLVED);
            }
          }
        ]
      };

      comp.dispatchEvent(
        new CustomEvent("omnimodal", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: modalConfig
        })
      );
    });
  }

  /**
   * Override default execute so the cancel action isn't immediately fired.
   * @scope api (public)
   */
  @api execute() {
    return Promise.resolve({ error: false });
  }
}

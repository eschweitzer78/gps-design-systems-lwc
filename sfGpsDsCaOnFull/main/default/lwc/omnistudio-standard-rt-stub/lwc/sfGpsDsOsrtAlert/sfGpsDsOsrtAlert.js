import { LightningElement, api, track } from "lwc";
import { VARIATIONS, DismissedEvent } from "./constants";
import { alertLabels as translatedLabels } from "c/sfGpsDsOsrtSalesforceUtils";

import sldsTemplate from "./alert_slds.html";
import ndsTemplate from "./alert_nds.html";

/**
 * A component representing either a slds or nds alert.
 * @see {@link https://www.lightningdesignsystem.com/components/alert/#Warning}
 * @see {@link https://nds.vlocity.tools/?path=/story/ui-components-alert--warning}
 * @module c/alert
 * @typicalName Alert
 * @slots default
 * @example
 * ``` html
 * <c-alert theme="slds"
 *          variation="info|warning|error|offline"
 *          icon="utility:trail"
 *          message="This is a simple message.">
 *            <span>For more <em>complex</em> messaging, use the default slot.
 *              <a href="https://lwc.dev/guide/composition#pass-markup-into-slots" target="_blank">Using slots.</a>
 *            </span>
 * </c-alert>
 * ```
 */

/**
 * @class Alert
 * @memberof module:c/alert
 */
export default class Alert extends LightningElement {
  /**
   * @type {string} - Style theme slds | nds.
   * @scope api (public)
   */
  @api theme = "slds";

  /**
   * @type {string} - Pass simple message into the component.
   * For messages containing markup, use the default slot.
   * If slotted content is passed. `Alert#message` will be ignored.
   * @scope api (public)
   */
  @api message;

  /**
   * @type {string} - An enum value representing the components style variation.
   * Only info, warning, error, or offline are accepted. If other values are passed, 'info' will be used.
   * @scope api (public)
   */
  @api variation = VARIATIONS.default;

  /**
   * @type {boolean} - If true, the alert will be dismissible.
   * @scope api (public)
   */
  @api dismissible = false;

  /**
   * @type {string} - The icon name in `spriteName:iconName` format. Pass an empty string to hide.
   * @see {@link https://www.lightningdesignsystem.com/icons/}
   * @example 'utility:info'
   */
  @api get icon() {
    return this._icon;
  }
  set icon(value) {
    this._icon = value;
  }

  /**
   * @type {string} - Css classes used to define the components variation.
   * @scope track (private)
   */
  @track componentClasses;

  /**
   * @type {boolean} - Prevents rendering of component when true.
   * @see {@link this#dismiss}
   * @scope track (private)
   */
  @track dismissed = false;

  /**
   * Dismisses the alert.
   * @fires Alert#dismissed
   */
  dismiss() {
    this.dismissed = true;

    this.dispatchEvent(new DismissedEvent());
  }

  //#region lifecycle hooks
  render() {
    if (this.theme === "nds") {
      return ndsTemplate;
    }
    return sldsTemplate;
  }

  translatedLabels = {};

  connectedCallback() {
    if (this._icon === undefined) {
      switch (this.variation) {
        case VARIATIONS.info:
          this._icon = "utility:info";
          break;
        case VARIATIONS.warning:
          this._icon = "utility:warning";
          break;
        case VARIATIONS.error:
          this._icon = "utility:error";
          break;
        case VARIATIONS.offline:
          this._icon = "utility:offline";
          break;
        default:
        // default should never hit
      }
    }
    this.translatedLabels = translatedLabels;
  }

  renderedCallback() {
    if (this.variation !== this._lastVariation) {
      this.componentClasses = [
        `${this.theme}-notify`,
        `${this.theme}-notify_alert`,
        `${this.theme}-theme_alert-texture`,
        `${this.theme}-theme_${this.variation}`
      ].join(" ");
      this._lastVariation = this.variation;
    }
  }
  //#endregion lifecycle hooks
}

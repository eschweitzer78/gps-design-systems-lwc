import { LightningElement, api } from "lwc";
import { progressBarLabels as translatedLabels } from "c/sfGpsDsOsrtSalesforceUtils";

/**
 * Custom element that will render a slds-progress-bar or nds-progress bar css component.
 * @module ns/progressBar
 * @typicalName ProgressBar
 * @extends LightningElement
 * @example
 * ``` html
 * <c-sf-gps-ds-osrt-progress-bar progress="0"
 *            size="x-small"
 *            theme="nds"
 *            transition="0.5"
 *            success>
 * </c-sf-gps-ds-osrt-progress-bar>
 * ```
 */

export default class ProgressBar extends LightningElement {
  //#region @api properties
  /**
   * @property {number} - Value representing the progress bar's completeness. Valid values from 0-100.
   * @scope api (public)
   * @default 0
   */
  _progress = 0;

  @api
  get progress() {
    return this._progress;
  }

  set progress(value) {
    this.setProgress(value);
  }

  /**
   * Corresponds to slds/nds styles determining size.
   * @property {'xx-small'|'x-small'|'small'|'medium'|'large'}
   * @default "small"
   * @scope api (public)
   */
  @api size = "small";

  /**
   * Number in seconds. Represents the css property transition-duration.
   * @property {number}
   * @scope api (public)
   */
  @api transition = 1;

  /**
   * Represents the theme being used. Either 'slds', or 'nds'.
   * @property {string}
   * @default "slds"
   * @scope api (public)
   */
  @api theme = "slds";

  /**
   * Flag when tru will render the component with success styling.
   * @property {boolean}
   * @scope api (public)
   */
  _success;

  @api
  get success() {
    return this._success;
  }

  set success(value) {
    this.setSuccess(value);
  }
  //#endregion @api properties

  /**
   * The HTML element which visually represents % complete. Set in connectedCallback.
   * @property {HTMLElement}
   * @scope private
   */
  _valueElement;

  _translatedLabels = {};

  //#endregion private properties

  //#region @api methods
  /**
   * Convenience method to sets the % of completeness of the progress bar value.
   * @param {number} value - Value representing the progress bar's completeness. Valid values from 0-100.
   * @scope api (public)
   * @example ``` JS
   * //..
   * const progressBar = this.template.querySelector('c-sf-gps-ds-osrt-progress-bar');
   * //...
   * // A fictional event handler which will update the progress bar.
   * handleProgressEvent(evt) {
   *     progressBar.setProgress(evt.detail);
   * }
   * ```
   */
  @api
  setProgress(value, transition) {
    this._progress = value;
    if (this._valueElement) {
      this._valueElement.style.transitionDuration = transition
        ? `${transition}s`
        : `${this.transition}s`;
      this._valueElement.style.width = `${value}%`;
    }
  }

  /**
   * Convenience method to set the value of ProgressBar.success.
   * @property {boolean} success - If success is true, the progress indicator will change to the success color.
   * @scope api (public
   * @example ``` JS
   * // A fictional event handler which will update the progress bar, and set success styling when progress reaches 100!
   * handleProgressEvent(evt) {
   *     progressBar.setProgress(evt.detail);
   *     if (evt.detail === '100') {
   *         progressBar.setSuccess(true);
   *     }
   * }
   * ```
   */
  @api
  setSuccess(success) {
    this._success = Boolean(success) && success !== "false" && success !== "0";

    if (!this._valueElement) return;

    if (this._success === true) {
      this._valueElement.classList.add(
        `${this.theme}-progress-bar__value_success`
      );
    } else {
      this._valueElement.classList.remove(
        `${this.theme}-progress-bar__value_success`
      );
    }
  }

  /**
   * Represents the accessible name.
   */
  _name;

  @api
  get name() {
    return this._name || this._translatedLabels.cmpProgress; //returns the custom label if not name is set otherwise it will be undefined.
  }

  set name(value) {
    this._name = value;
  }
  //#endregion @api methods

  //#region lifecycle callbacks.
  connectedCallback() {
    this._translatedLabels = translatedLabels;
  }

  get componentClasses() {
    return `${this.theme}-progress-bar ${this.theme}-progress-bar_${this.size}`;
  }

  get valueClasses() {
    return `${this.theme}-progress-bar__value`;
  }

  get textClass() {
    return `${this.theme}-assistive-text`;
  }

  renderedCallback() {
    if (!this._initialRenderComplete) {
      this._valueElement = this.template.querySelector(
        "[data-progress-bar-value]"
      );

      this.setProgress(this._progress);

      if (this._success) {
        this.setSuccess(this._success);
      }
      this._initialRenderComplete = true;
    }
  }
  //#endregion
}
